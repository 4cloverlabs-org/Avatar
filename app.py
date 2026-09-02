import os
import time
import pdb
import re
import uuid
import json
import logging
from pathlib import Path
import torch
import warnings
warnings.filterwarnings("ignore")

# Force torch.load to always use weights_only=False globally
_original_load = torch.serialization.load
def _patched_load(*args, **kwargs):
    if "weights_only" not in kwargs:
        kwargs["weights_only"] = False
    return _original_load(*args, **kwargs)
torch.serialization.load = _patched_load
torch.load = _patched_load

try:
    from TTS.api import TTS
    HAS_TTS = True
except ImportError:
    HAS_TTS = False

import gradio as gr
import numpy as np
import sys
import subprocess

from huggingface_hub import snapshot_download
import requests

import argparse
from omegaconf import OmegaConf
import cv2
import torch
import numpy.core.multiarray
import numpy
try:
    torch.serialization.add_safe_globals([numpy.core.multiarray._reconstruct, numpy.ndarray])
except AttributeError:
    pass
import glob
import pickle
from tqdm import tqdm
import copy
from argparse import Namespace
import shutil
import gdown
import imageio
import ffmpeg
from moviepy.editor import *
from transformers import WhisperModel

ProjectDir = os.path.abspath(os.path.dirname(__file__))
CheckpointsDir = os.path.join(ProjectDir, "models")

tts_model = None

def init_tts():
    global tts_model
    if not HAS_TTS:
        return "TTS package not installed"
    
    if tts_model is None:
        print("[TTS] Loading XTTS-v2 model...")
        os.environ["COQUI_TOS_AGREED"] = "1"
        try:
            tts_model = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)
            print("[TTS] Model loaded successfully.")
            return None # No error
        except Exception as e:
            err_msg = f"[TTS] Failed to load model: {e}"
            print(err_msg)
            return err_msg
    return None

@torch.no_grad()
def debug_inpainting(video_path, bbox_shift, extra_margin=10, parsing_mode="jaw", 
                    left_cheek_width=90, right_cheek_width=90):
    args_dict = {
        "result_dir": './results/debug', 
        "fps": 25, 
        "batch_size": 1, 
        "output_vid_name": '', 
        "use_saved_coord": False,
        "audio_padding_length_left": 2,
        "audio_padding_length_right": 2,
        "version": "v15",
        "extra_margin": extra_margin,
        "parsing_mode": parsing_mode,
        "left_cheek_width": left_cheek_width,
        "right_cheek_width": right_cheek_width
    }
    args = Namespace(**args_dict)

    os.makedirs(args.result_dir, exist_ok=True)
    
    if get_file_type(video_path) == "video":
        reader = imageio.get_reader(video_path)
        first_frame = reader.get_data(0)
        reader.close()
    else:
        first_frame = cv2.imread(video_path)
        first_frame = cv2.cvtColor(first_frame, cv2.COLOR_BGR2RGB)
    
    debug_frame_path = os.path.join(args.result_dir, "debug_frame.png")
    cv2.imwrite(debug_frame_path, cv2.cvtColor(first_frame, cv2.COLOR_RGB2BGR))
    
    coord_list, frame_list = get_landmark_and_bbox([debug_frame_path], bbox_shift)
    bbox = coord_list[0]
    frame = frame_list[0]
    
    if bbox == coord_placeholder:
        return None, "No face detected, please adjust bbox_shift parameter"
    
    fp = FaceParsing(
        left_cheek_width=args.left_cheek_width,
        right_cheek_width=args.right_cheek_width
    )
    
    x1, y1, x2, y2 = bbox
    x1 = max(0, int(x1))
    y1 = max(0, int(y1))
    x2 = min(frame.shape[1], int(x2))
    y2 = min(frame.shape[0], int(y2) + args.extra_margin)
    crop_frame = frame[y1:y2, x1:x2]
    crop_frame = cv2.resize(crop_frame,(256,256),interpolation = cv2.INTER_LANCZOS4)
    
    random_audio = torch.randn(1, 50, 384, device=device, dtype=weight_dtype)
    audio_feature = pe(random_audio)
    
    latents = vae.get_latents_for_unet(crop_frame)
    latents = latents.to(dtype=weight_dtype)
    
    pred_latents = unet.model(latents, timesteps, encoder_hidden_states=audio_feature).sample
    recon = vae.decode_latents(pred_latents)
    
    res_frame = recon[0]
    res_frame = cv2.resize(res_frame.astype(np.uint8),(x2-x1,y2-y1))
    combine_frame = get_image(frame, res_frame, [x1, y1, x2, y2], mode=args.parsing_mode, fp=fp)
    
    debug_result_path = os.path.join(args.result_dir, "debug_result.png")
    cv2.imwrite(debug_result_path, combine_frame)
    
    info_text = f"Parameter information:\n" + \
                f"bbox_shift: {bbox_shift}\n" + \
                f"extra_margin: {extra_margin}\n" + \
                f"parsing_mode: {parsing_mode}\n" + \
                f"left_cheek_width: {left_cheek_width}\n" + \
                f"right_cheek_width: {right_cheek_width}\n" + \
                f"Detected face coordinates: [{x1}, {y1}, {x2}, {y2}]"
    
    return cv2.cvtColor(combine_frame, cv2.COLOR_RGB2BGR), info_text

def print_directory_contents(path):
    for child in os.listdir(path):
        child_path = os.path.join(path, child)
        if os.path.isdir(child_path):
            print(child_path)

def download_model():
    required_models = {
        "MuseTalk": f"{CheckpointsDir}/musetalkV15/unet.pth",
        "MuseTalkConfig": f"{CheckpointsDir}/musetalkV15/musetalk.json",
        "SD VAE": f"{CheckpointsDir}/sd-vae/config.json",
        "Whisper": f"{CheckpointsDir}/whisper/config.json",
        "DWPose": f"{CheckpointsDir}/dwpose/dw-ll_ucoco_384.pth",
        "SyncNet": f"{CheckpointsDir}/syncnet/latentsync_syncnet.pt",
        "Face Parse": f"{CheckpointsDir}/face-parse-bisent/79999_iter.pth",
        "ResNet": f"{CheckpointsDir}/face-parse-bisent/resnet18-5c106cde.pth"
    }
    
    missing_models = []
    for model_name, model_path in required_models.items():
        if not os.path.exists(model_path):
            missing_models.append(model_name)
    
    if missing_models:
        print("The following required model files are missing:")
        for model in missing_models:
            print(f"- {model}")
        print("\nPlease run the download script to download the missing models:")
        if sys.platform == "win32":
            print("Windows: Run download_weights.bat")
        else:
            print("Linux/Mac: Run ./download_weights.sh")
        sys.exit(1)
    else:
        print("All required model files exist.")

download_model()

# Workaround for diffusers 0.27.2 on newer huggingface_hub
import huggingface_hub
if not hasattr(huggingface_hub, 'cached_download'):
    huggingface_hub.cached_download = huggingface_hub.hf_hub_download

from musetalk.utils.preprocessing import get_landmark_and_bbox, read_imgs, coord_placeholder, get_bbox_range
from musetalk.utils.blending import get_image
from musetalk.utils.face_parsing import FaceParsing
from musetalk.utils.audio_processor import AudioProcessor
from musetalk.utils.utils import get_file_type, get_video_fps, datagen, load_all_model

def fast_check_ffmpeg():
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        return True
    except:
        return False

@torch.no_grad()
def inference(audio_path, video_path, bbox_shift, extra_margin=10, parsing_mode="jaw", 
              left_cheek_width=90, right_cheek_width=90, use_gfpgan=True, gfpgan_weight=0.5, progress=gr.Progress(track_tqdm=True)):
    args_dict = {
        "result_dir": './results/output', 
        "fps": 25, 
        "batch_size": 8, 
        "output_vid_name": '', 
        "use_saved_coord": False,
        "audio_padding_length_left": 2,
        "audio_padding_length_right": 2,
        "version": "v15",
        "extra_margin": extra_margin,
        "parsing_mode": parsing_mode,
        "left_cheek_width": left_cheek_width,
        "right_cheek_width": right_cheek_width
    }
    args = Namespace(**args_dict)

    if not fast_check_ffmpeg():
        print("Warning: Unable to find ffmpeg, please ensure ffmpeg is properly installed")

    input_basename = os.path.basename(video_path).split('.')[0]
    audio_basename = os.path.basename(audio_path).split('.')[0]

    if get_file_type(video_path) == "video":
        original_fps = get_video_fps(video_path)
        if abs(original_fps - 25) > 0.5:
            print(f"Converting video from {original_fps} fps to 25 fps...")
            new_video_path = os.path.join(args.result_dir, f"{input_basename}_25fps.mp4")
            subprocess.run(["ffmpeg", "-y", "-i", video_path, "-r", "25", new_video_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            video_path = new_video_path
            input_basename = f"{input_basename}_25fps"

    output_basename = f"{input_basename}_{audio_basename}"
    temp_dir = os.path.join(args.result_dir, f"{args.version}")
    os.makedirs(temp_dir, exist_ok=True)
    
    result_img_save_path = os.path.join(temp_dir, output_basename)
    crop_coord_save_path = os.path.join(args.result_dir, "../", input_basename+".pkl")
    
    if os.path.exists(result_img_save_path):
        shutil.rmtree(result_img_save_path)
    os.makedirs(result_img_save_path, exist_ok=True)

    if args.output_vid_name == "":
        output_vid_name = os.path.join(temp_dir, output_basename+".mp4")
    else:
        output_vid_name = os.path.join(temp_dir, args.output_vid_name)
        
    if get_file_type(video_path) == "video":
        save_dir_full = os.path.join(temp_dir, input_basename)
        if os.path.exists(save_dir_full):
            shutil.rmtree(save_dir_full)
        os.makedirs(save_dir_full, exist_ok=True)
        reader = imageio.get_reader(video_path)
        for i, im in enumerate(reader):
            imageio.imwrite(f"{save_dir_full}/{i:08d}.png", im)
        input_img_list = sorted(glob.glob(os.path.join(save_dir_full, '*.[jpJP][pnPN]*[gG]')))
        fps = get_video_fps(video_path)
    else: 
        input_img_list = glob.glob(os.path.join(video_path, '*.[jpJP][pnPN]*[gG]'))
        input_img_list = sorted(input_img_list, key=lambda x: int(os.path.splitext(os.path.basename(x))[0]))
        fps = args.fps
        
    whisper_input_features, librosa_length = audio_processor.get_audio_feature(audio_path)
    whisper_chunks = audio_processor.get_whisper_chunk(
        whisper_input_features, 
        device, 
        weight_dtype, 
        whisper, 
        librosa_length,
        fps=fps,
        audio_padding_length_left=args.audio_padding_length_left,
        audio_padding_length_right=args.audio_padding_length_right,
    )
        
    if os.path.exists(crop_coord_save_path) and args.use_saved_coord:
        with open(crop_coord_save_path,'rb') as f:
            coord_list = pickle.load(f)
        frame_list = read_imgs(input_img_list)
    else:
        coord_list, frame_list = get_landmark_and_bbox(input_img_list, bbox_shift)
        with open(crop_coord_save_path, 'wb') as f:
            pickle.dump(coord_list, f)
    bbox_shift_text = get_bbox_range(input_img_list, bbox_shift)
    
    fp = FaceParsing(
        left_cheek_width=args.left_cheek_width,
        right_cheek_width=args.right_cheek_width
    )
    
    input_latent_list = []
    for bbox, frame in zip(coord_list, frame_list):
        if bbox == coord_placeholder:
            continue
        x1, y1, x2, y2 = bbox
        x1 = max(0, int(x1))
        y1 = max(0, int(y1))
        x2 = min(frame.shape[1], int(x2))
        y2 = min(frame.shape[0], int(y2) + args.extra_margin)
        if x1 >= x2 or y1 >= y2:
            crop_frame = np.zeros((256, 256, 3), dtype=np.uint8)
        else:
            crop_frame = frame[y1:y2, x1:x2]
            crop_frame = cv2.resize(crop_frame,(256,256),interpolation = cv2.INTER_LANCZOS4)
        latents = vae.get_latents_for_unet(crop_frame)
        input_latent_list.append(latents)

    frame_list_cycle = frame_list + frame_list[::-1]
    coord_list_cycle = coord_list + coord_list[::-1]
    input_latent_list_cycle = input_latent_list + input_latent_list[::-1]
    
    video_num = len(whisper_chunks)
    batch_size = args.batch_size
    gen = datagen(
        whisper_chunks=whisper_chunks,
        vae_encode_latents=input_latent_list_cycle,
        batch_size=batch_size,
        delay_frame=0,
        device=device,
    )
    res_frame_list = []
    for i, (whisper_batch,latent_batch) in enumerate(tqdm(gen,total=int(np.ceil(float(video_num)/batch_size)))):
        audio_feature_batch = pe(whisper_batch)
        latent_batch = latent_batch.to(dtype=weight_dtype)
        
        pred_latents = unet.model(latent_batch, timesteps, encoder_hidden_states=audio_feature_batch).sample
        recon = vae.decode_latents(pred_latents)
        for res_frame in recon:
            res_frame_list.append(res_frame)
            
    for i, res_frame in enumerate(tqdm(res_frame_list)):
        bbox = coord_list_cycle[i%(len(coord_list_cycle))]
        ori_frame = copy.deepcopy(frame_list_cycle[i%(len(frame_list_cycle))])
        x1, y1, x2, y2 = bbox
        y2 = y2 + args.extra_margin
        y2 = min(y2, frame.shape[0])
        try:
            res_frame = cv2.resize(res_frame.astype(np.uint8),(x2-x1,y2-y1))
        except:
            continue
        
        combine_frame = get_image(ori_frame, res_frame, [x1, y1, x2, y2], mode=args.parsing_mode, fp=fp)
            
        if use_gfpgan and 'gfpganer' in globals() and gfpganer is not None:
            _, _, combine_frame = gfpganer.enhance(combine_frame, has_aligned=False, only_center_face=True, paste_back=True, weight=gfpgan_weight)

        cv2.imwrite(f"{result_img_save_path}/{str(i).zfill(8)}.png",combine_frame)
        
    output_video = 'temp.mp4'

    def is_valid_image(file):
        pattern = re.compile(r'\d{8}\.png')
        return pattern.match(file)

    images = []
    files = [file for file in os.listdir(result_img_save_path) if is_valid_image(file)]
    files.sort(key=lambda x: int(x.split('.')[0]))

    for file in files:
        filename = os.path.join(result_img_save_path, file)
        images.append(imageio.imread(filename))
        
    imageio.mimwrite(output_video, images, 'FFMPEG', fps=fps, codec='libx264', pixelformat='yuv420p')

    video_clip = VideoFileClip(output_video)
    audio_clip = AudioFileClip(audio_path)
    video_clip = video_clip.set_audio(audio_clip)
    video_clip.write_videofile(output_vid_name, codec='libx264', audio_codec='aac',fps=25)

    os.remove("temp.mp4")
    return output_vid_name, bbox_shift_text

def generate_speech(text, voice_id):
    global tts_model
    
    if not HAS_TTS:
        return "Error: TTS package is not installed."
        
    # Auto-agree to terms to prevent hanging on input
    os.environ["COQUI_TOS_AGREED"] = "1"
    
    if tts_model is None:
        err = init_tts()
        if err:
            return f"Error initializing TTS: {err}"
            
    if tts_model is None:
         return "Error: tts_model is still None after initialization."
         
    voice_dir = os.path.join("./results/voices", voice_id)
    sample_path = os.path.join(voice_dir, "sample.wav")
    
    if not os.path.exists(sample_path):
        return f"Error: Voice sample for {voice_id} not found at {sample_path}."
        
    output_path = os.path.join(voice_dir, "generated_output.wav")
    
    try:
        print(f"[TTS] Generating speech for voice {voice_id}...")
        tts_model.tts_to_file(
            text=text,
            speaker_wav=sample_path,
            language="en",
            file_path=output_path
        )
        return output_path
    except Exception as e:
        return f"Error during TTS generation: {str(e)}"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
vae, unet, pe = load_all_model(
    unet_model_path="./models/musetalkV15/unet.pth", 
    vae_type="sd-vae",
    unet_config="./models/musetalkV15/musetalk.json",
    device=device
)

try:
    from gfpgan import GFPGANer
    gfpganer = GFPGANer(
        model_path='https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth',
        upscale=1,
        arch='clean',
        channel_multiplier=2,
        bg_upsampler=None)
except ImportError:
    gfpganer = None

parser = argparse.ArgumentParser()
parser.add_argument("--ffmpeg_path", type=str, default=r"ffmpeg-master-latest-win64-gpl-shared\bin", help="Path to ffmpeg executable")
parser.add_argument("--ip", type=str, default="127.0.0.1", help="IP address to bind to")
parser.add_argument("--port", type=int, default=7860, help="Port to bind to")
parser.add_argument("--share", action="store_true", help="Create a public link")
parser.add_argument("--use_float16", action="store_true", help="Use float16 for faster inference")
args = parser.parse_args()

if args.use_float16:
    pe = pe.half()
    vae.vae = vae.vae.half()
    unet.model = unet.model.half()
    weight_dtype = torch.float16
else:
    weight_dtype = torch.float32

pe = pe.to(device)
vae.vae = vae.vae.to(device)
unet.model = unet.model.to(device)

timesteps = torch.tensor([0], device=device)

audio_processor = AudioProcessor(feature_extractor_path="./models/whisper")
whisper = WhisperModel.from_pretrained("./models/whisper")
whisper = whisper.to(device=device, dtype=weight_dtype).eval()
whisper.requires_grad_(False)

from transformers import pipeline
transcriber = pipeline("automatic-speech-recognition", model="openai/whisper-tiny")

def transcribe_audio(audio_path):
    if not audio_path:
        return ""
    try:
        result = transcriber(audio_path)
        return result.get("text", "").strip()
    except Exception as e:
        return ""

@torch.no_grad()
def prepare_avatar(video_path, bbox_shift, extra_margin=10, parsing_mode="jaw", 
              left_cheek_width=90, right_cheek_width=90, progress=gr.Progress(track_tqdm=True)):
    args_dict = {
        "result_dir": './results/output', 
        "fps": 25, 
        "batch_size": 8, 
        "output_vid_name": '', 
        "use_saved_coord": False,
        "audio_padding_length_left": 2,
        "audio_padding_length_right": 2,
        "version": "v15",
        "extra_margin": extra_margin,
        "parsing_mode": parsing_mode,
        "left_cheek_width": left_cheek_width,
        "right_cheek_width": right_cheek_width
    }
    args = Namespace(**args_dict)
    avatar_id = str(uuid.uuid4())
    avatar_dir = os.path.join("./results/avatars", avatar_id)
    os.makedirs(avatar_dir, exist_ok=True)
    
    if get_file_type(video_path) == "video":
        input_basename = os.path.basename(video_path).split('.')[0]
        new_video_path = os.path.join(avatar_dir, f"{input_basename}_25fps.mp4")
        subprocess.run(["ffmpeg", "-y", "-i", video_path, "-r", "25", new_video_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        video_path = new_video_path
                
        save_dir_full = os.path.join(avatar_dir, "full_imgs")
        os.makedirs(save_dir_full, exist_ok=True)
        reader = imageio.get_reader(video_path, format='ffmpeg')
        for i, im in enumerate(reader):
            imageio.imwrite(f"{save_dir_full}/{i:08d}.png", im)
        input_img_list = sorted(glob.glob(os.path.join(save_dir_full, '*.[jpJP][pnPN]*[gG]')))
        fps = get_video_fps(video_path)
    else: 
        input_img_list = glob.glob(os.path.join(video_path, '*.[jpJP][pnPN]*[gG]'))
        input_img_list = sorted(input_img_list, key=lambda x: int(os.path.splitext(os.path.basename(x))[0]))
        fps = args.fps
        
    coord_list, frame_list = get_landmark_and_bbox(input_img_list, bbox_shift)
    bbox_shift_text = get_bbox_range(input_img_list, bbox_shift)
    
    input_latent_list = []
    for bbox, frame in tqdm(zip(coord_list, frame_list), total=len(coord_list)):
        if bbox == coord_placeholder:
            if len(input_latent_list) > 0:
                input_latent_list.append(input_latent_list[-1])
            else:
                input_latent_list.append(vae.get_latents_for_unet(np.zeros((256, 256, 3), dtype=np.uint8)))
            continue
        x1, y1, x2, y2 = bbox
        x1, y1 = max(0, int(x1)), max(0, int(y1))
        x2, y2 = min(frame.shape[1], int(x2)), min(frame.shape[0], int(y2) + args.extra_margin)
        crop_frame = cv2.resize(frame[y1:y2, x1:x2],(256,256),interpolation = cv2.INTER_LANCZOS4) if x1 < x2 and y1 < y2 else np.zeros((256, 256, 3), dtype=np.uint8)
        input_latent_list.append(vae.get_latents_for_unet(crop_frame))
        
    frame_list_cycle = frame_list + frame_list[::-1]
    coord_list_cycle = coord_list + coord_list[::-1]
    input_latent_list_cycle = input_latent_list + input_latent_list[::-1]
    with open(os.path.join(avatar_dir, 'coords.pkl'), 'wb') as f: pickle.dump(coord_list_cycle, f)
    torch.save(input_latent_list_cycle, os.path.join(avatar_dir, 'latents.pt'))
    with open(os.path.join(avatar_dir, 'frames.pkl'), 'wb') as f: pickle.dump(frame_list_cycle, f)
    with open(os.path.join(avatar_dir, 'meta.json'), 'w') as f: json.dump({"fps": fps, "args": args_dict}, f)
    return avatar_id

@torch.no_grad()
def generate_from_avatar(avatar_id, audio_path, use_gfpgan=True, gfpgan_weight=0.5, aspect_ratio="Original", progress=gr.Progress(track_tqdm=True)):
    avatar_dir = os.path.join("./results/avatars", avatar_id)
    with open(os.path.join(avatar_dir, 'meta.json'), 'r') as f: meta = json.load(f)
    fps, args = meta["fps"], Namespace(**meta["args"])
    with open(os.path.join(avatar_dir, 'coords.pkl'), 'rb') as f: coord_list_cycle = pickle.load(f)
    input_latent_list_cycle = torch.load(os.path.join(avatar_dir, 'latents.pt'))
    with open(os.path.join(avatar_dir, 'frames.pkl'), 'rb') as f: frame_list_cycle = pickle.load(f)
    
    whisper_chunks = audio_processor.get_whisper_chunk(audio_processor.get_audio_feature(audio_path)[0], device, weight_dtype, whisper, audio_processor.get_audio_feature(audio_path)[1], fps=fps)
    gen = datagen(whisper_chunks=whisper_chunks, vae_encode_latents=input_latent_list_cycle, batch_size=args.batch_size, delay_frame=0, device=device)
    res_frame_list = []
    for _, (w_batch, l_batch) in enumerate(gen):
        for res in vae.decode_latents(unet.model(l_batch.to(weight_dtype), timesteps, encoder_hidden_states=pe(w_batch)).sample):
            res_frame_list.append(res)
            
    temp_dir = os.path.join(avatar_dir, "output")
    os.makedirs(temp_dir, exist_ok=True)
    for i, res_frame in enumerate(res_frame_list):
        bbox = coord_list_cycle[i % len(coord_list_cycle)]
        ori = copy.deepcopy(frame_list_cycle[i % len(frame_list_cycle)])
        if bbox != coord_placeholder:
            x1, y1, x2, y2 = bbox
            try:
                res = cv2.resize(res_frame.astype(np.uint8), (x2-x1, min(y2+args.extra_margin, ori.shape[0])-y1))
                combine = get_image(ori, res, [x1, y1, x2, min(y2+args.extra_margin, ori.shape[0])], mode=args.parsing_mode, fp=FaceParsing())
                if use_gfpgan and gfpganer:
                    _, _, combine = gfpganer.enhance(combine, has_aligned=False, only_center_face=True, paste_back=True, weight=gfpgan_weight)
                cv2.imwrite(f"{temp_dir}/{i:08d}.png", combine)
            except: pass
    
    import time
    timestamp = int(time.time())
    out_vid = os.path.join(temp_dir, f'out_{timestamp}.mp4')
    imageio.mimwrite(out_vid, [imageio.imread(f) for f in sorted(glob.glob(f"{temp_dir}/*.png"))], 'FFMPEG', fps=fps, codec='libx264')
    final = os.path.join(temp_dir, f"final_{timestamp}.mp4")
    VideoFileClip(out_vid).set_audio(AudioFileClip(audio_path)).write_videofile(final, codec='libx264', audio_codec='aac', fps=25)
    
    # Cleanup temp frames and raw out_vid to save space
    for f in glob.glob(f"{temp_dir}/*.png"):
        os.remove(f)
    if os.path.exists(out_vid):
        os.remove(out_vid)
        
    # Handle aspect ratio cropping
    if aspect_ratio and aspect_ratio != "Original" and "/" in aspect_ratio:
        try:
            w, h = aspect_ratio.split('/')
            cropped_final = os.path.join(temp_dir, f"final_{timestamp}_{w}x{h}.mp4")
            import subprocess
            cmd = f'ffmpeg -y -i "{final}" -vf "crop=trunc(min(iw\\,ih*{w}/{h})/2)*2:trunc(min(ih\\,iw*{h}/{w})/2)*2" -c:v libx264 -c:a copy "{cropped_final}"'
            subprocess.run(cmd, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(cropped_final):
                os.remove(final)
                final = cropped_final
        except Exception as e:
            print(f"Failed to crop video to {aspect_ratio}: {e}")
            
    return final

def check_video(video):
    if not isinstance(video, str) or os.path.basename(video).startswith("outputxxx_"): return video
    output = os.path.join('./results/input', "outputxxx_" + os.path.basename(video))
    reader = imageio.get_reader(video)
    fps, frames = reader.get_meta_data()['fps'], [im for im in reader]
    imageio.mimwrite(output, frames, 'FFMPEG', fps=25, codec='libx264', quality=9, pixelformat='yuv420p')
    return output

css = """
/* Styling omitted for brevity */
"""

with gr.Blocks(analytics_enabled=False) as demo:
    # Hidden components for API usage
    video = gr.Video(visible=False)
    audio = gr.Audio(type="filepath", visible=False)
    bbox_shift = gr.Number(value=0, visible=False)
    extra_margin = gr.Number(value=10, visible=False)
    parsing_mode = gr.Text(value="jaw", visible=False)
    left_cheek_width = gr.Number(value=90, visible=False)
    right_cheek_width = gr.Number(value=90, visible=False)
    use_gfpgan = gr.Checkbox(value=True, visible=False)
    gfpgan_weight = gr.Number(value=0.5, visible=False)
    script_text = gr.Text(visible=False)
    voice_id = gr.Text(visible=False)
    avatar_id_output = gr.Text(visible=False)
    out1 = gr.Video(visible=False)
    bbox_shift_scale = gr.Text(visible=False)
    debug_image = gr.Image(visible=False)
    debug_info = gr.Text(visible=False)
    speech_output = gr.Text(visible=False)

    aspect_ratio_input = gr.Text(value="Original", visible=False)
    
    # API Endpoints
    inference_btn = gr.Button(visible=False)
    inference_btn.click(
        fn=inference,
        inputs=[audio, video, bbox_shift, extra_margin, parsing_mode, left_cheek_width, right_cheek_width, use_gfpgan, gfpgan_weight],
        outputs=[out1, bbox_shift_scale],
        api_name="inference"
    )

    debug_btn = gr.Button(visible=False)
    debug_btn.click(
        fn=debug_inpainting,
        inputs=[video, bbox_shift, extra_margin, parsing_mode, left_cheek_width, right_cheek_width],
        outputs=[debug_image, debug_info],
        api_name="debug_inpainting"
    )

    prepare_btn = gr.Button(visible=False)
    prepare_btn.click(
        fn=prepare_avatar,
        inputs=[video, bbox_shift, extra_margin, parsing_mode, left_cheek_width, right_cheek_width],
        outputs=[avatar_id_output],
        api_name="prepare_avatar"
    )

    generate_btn = gr.Button(visible=False)
    generate_btn.click(
        fn=generate_from_avatar,
        inputs=[avatar_id_output, audio, use_gfpgan, gfpgan_weight, aspect_ratio_input],
        outputs=[out1],
        api_name="generate_from_avatar"
    )

    transcribe_btn = gr.Button(visible=False)
    transcribe_btn.click(
        fn=transcribe_audio,
        inputs=[audio],
        outputs=[script_text],
        api_name="transcribe"
    )

    generate_speech_btn = gr.Button(visible=False)
    generate_speech_btn.click(
        fn=generate_speech,
        inputs=[script_text, voice_id],
        outputs=[speech_output],
        api_name="generate_speech"
    )

# Check ffmpeg and add to PATH
if not fast_check_ffmpeg():
    print(f"Adding ffmpeg to PATH: {args.ffmpeg_path}")
    # According to operating system, choose path separator
    path_separator = ';' if sys.platform == 'win32' else ':'
    os.environ["PATH"] = f"{args.ffmpeg_path}{path_separator}{os.environ['PATH']}"
    if not fast_check_ffmpeg():
        print("Warning: Unable to find ffmpeg, please ensure ffmpeg is properly installed")

# Solve asynchronous IO issues on Windows
if sys.platform == 'win32':
    import asyncio
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# Start Gradio application
if __name__ == "__main__":
    demo.queue().launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        debug=True
    )
