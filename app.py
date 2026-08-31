import os
import time
import pdb
import re
import uuid
import json

import gradio as gr
import numpy as np
import sys
import subprocess

from huggingface_hub import snapshot_download
import requests

import argparse
import os
from omegaconf import OmegaConf
import numpy as np
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

@torch.no_grad()
def debug_inpainting(video_path, bbox_shift, extra_margin=10, parsing_mode="jaw", 
                    left_cheek_width=90, right_cheek_width=90):
    """Debug inpainting parameters, only process the first frame"""
    # Set default parameters
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

    # Create debug directory
    os.makedirs(args.result_dir, exist_ok=True)
    
    # Read first frame
    if get_file_type(video_path) == "video":
        reader = imageio.get_reader(video_path)
        first_frame = reader.get_data(0)
        reader.close()
    else:
        first_frame = cv2.imread(video_path)
        first_frame = cv2.cvtColor(first_frame, cv2.COLOR_BGR2RGB)
    
    # Save first frame
    debug_frame_path = os.path.join(args.result_dir, "debug_frame.png")
    cv2.imwrite(debug_frame_path, cv2.cvtColor(first_frame, cv2.COLOR_RGB2BGR))
    
    # Get face coordinates
    coord_list, frame_list = get_landmark_and_bbox([debug_frame_path], bbox_shift)
    bbox = coord_list[0]
    frame = frame_list[0]
    
    if bbox == coord_placeholder:
        return None, "No face detected, please adjust bbox_shift parameter"
    
    # Initialize face parser
    fp = FaceParsing(
        left_cheek_width=args.left_cheek_width,
        right_cheek_width=args.right_cheek_width
    )
    
    # Process first frame
    x1, y1, x2, y2 = bbox
    x1 = max(0, int(x1))
    y1 = max(0, int(y1))
    x2 = min(frame.shape[1], int(x2))
    y2 = min(frame.shape[0], int(y2) + args.extra_margin)
    crop_frame = frame[y1:y2, x1:x2]
    crop_frame = cv2.resize(crop_frame,(256,256),interpolation = cv2.INTER_LANCZOS4)
    
    # Generate random audio features
    random_audio = torch.randn(1, 50, 384, device=device, dtype=weight_dtype)
    audio_feature = pe(random_audio)
    
    # Get latents
    latents = vae.get_latents_for_unet(crop_frame)
    latents = latents.to(dtype=weight_dtype)
    
    # Generate prediction results
    pred_latents = unet.model(latents, timesteps, encoder_hidden_states=audio_feature).sample
    recon = vae.decode_latents(pred_latents)
    
    # Inpaint back to original image
    res_frame = recon[0]
    res_frame = cv2.resize(res_frame.astype(np.uint8),(x2-x1,y2-y1))
    combine_frame = get_image(frame, res_frame, [x1, y1, x2, y2], mode=args.parsing_mode, fp=fp)
    
    # Save results (no need to convert color space again since get_image already returns RGB format)
    debug_result_path = os.path.join(args.result_dir, "debug_result.png")
    cv2.imwrite(debug_result_path, combine_frame)
    
    # Create information text
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
    # 检查必需的模型文件是否存在
    required_models = {
        "MuseTalk": f"{CheckpointsDir}/musetalkV15/unet.pth",
        "MuseTalk": f"{CheckpointsDir}/musetalkV15/musetalk.json",
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
        # 全用英文
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




download_model()  # for huggingface deployment.

from musetalk.utils.blending import get_image
from musetalk.utils.face_parsing import FaceParsing
from musetalk.utils.audio_processor import AudioProcessor
from musetalk.utils.utils import get_file_type, get_video_fps, datagen, load_all_model
from musetalk.utils.preprocessing import get_landmark_and_bbox, read_imgs, coord_placeholder, get_bbox_range


def fast_check_ffmpeg():
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        return True
    except:
        return False


@torch.no_grad()
def inference(audio_path, video_path, bbox_shift, extra_margin=10, parsing_mode="jaw", 
              left_cheek_width=90, right_cheek_width=90, use_gfpgan=True, gfpgan_weight=0.5, progress=gr.Progress(track_tqdm=True)):
    # Set default parameters, aligned with inference.py
    args_dict = {
        "result_dir": './results/output', 
        "fps": 25, 
        "batch_size": 8, 
        "output_vid_name": '', 
        "use_saved_coord": False,
        "audio_padding_length_left": 2,
        "audio_padding_length_right": 2,
        "version": "v15",  # Fixed use v15 version
        "extra_margin": extra_margin,
        "parsing_mode": parsing_mode,
        "left_cheek_width": left_cheek_width,
        "right_cheek_width": right_cheek_width
    }
    args = Namespace(**args_dict)

    # Check ffmpeg
    if not fast_check_ffmpeg():
        print("Warning: Unable to find ffmpeg, please ensure ffmpeg is properly installed")

    input_basename = os.path.basename(video_path).split('.')[0]
    audio_basename = os.path.basename(audio_path).split('.')[0]

    # Force video to 25 FPS before processing
    if get_file_type(video_path) == "video":
        original_fps = get_video_fps(video_path)
        if abs(original_fps - 25) > 0.5:
            print(f"Converting video from {original_fps} fps to 25 fps...")
            new_video_path = os.path.join(args.result_dir, f"{input_basename}_25fps.mp4")
            subprocess.run(["ffmpeg", "-y", "-i", video_path, "-r", "25", new_video_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            video_path = new_video_path
            input_basename = f"{input_basename}_25fps"

    output_basename = f"{input_basename}_{audio_basename}"
    
    # Create temporary directory
    temp_dir = os.path.join(args.result_dir, f"{args.version}")
    os.makedirs(temp_dir, exist_ok=True)
    
    # Set result save path
    result_img_save_path = os.path.join(temp_dir, output_basename)
    crop_coord_save_path = os.path.join(args.result_dir, "../", input_basename+".pkl")
    
    import shutil
    if os.path.exists(result_img_save_path):
        shutil.rmtree(result_img_save_path)
    os.makedirs(result_img_save_path, exist_ok=True)

    if args.output_vid_name == "":
        output_vid_name = os.path.join(temp_dir, output_basename+".mp4")
    else:
        output_vid_name = os.path.join(temp_dir, args.output_vid_name)
        
    ############################################## extract frames from source video ##############################################
    if get_file_type(video_path) == "video":
        save_dir_full = os.path.join(temp_dir, input_basename)
        if os.path.exists(save_dir_full):
            shutil.rmtree(save_dir_full)
        os.makedirs(save_dir_full, exist_ok=True)
        # Read video
        reader = imageio.get_reader(video_path)

        # Save images
        for i, im in enumerate(reader):
            imageio.imwrite(f"{save_dir_full}/{i:08d}.png", im)
        input_img_list = sorted(glob.glob(os.path.join(save_dir_full, '*.[jpJP][pnPN]*[gG]')))
        fps = get_video_fps(video_path)
    else: # input img folder
        input_img_list = glob.glob(os.path.join(video_path, '*.[jpJP][pnPN]*[gG]'))
        input_img_list = sorted(input_img_list, key=lambda x: int(os.path.splitext(os.path.basename(x))[0]))
        fps = args.fps
        
    ############################################## extract audio feature ##############################################
    # Extract audio features
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
        
    ############################################## preprocess input image  ##############################################
    if os.path.exists(crop_coord_save_path) and args.use_saved_coord:
        print("using extracted coordinates")
        with open(crop_coord_save_path,'rb') as f:
            coord_list = pickle.load(f)
        frame_list = read_imgs(input_img_list)
    else:
        print("extracting landmarks...time consuming")
        coord_list, frame_list = get_landmark_and_bbox(input_img_list, bbox_shift)
        with open(crop_coord_save_path, 'wb') as f:
            pickle.dump(coord_list, f)
    bbox_shift_text = get_bbox_range(input_img_list, bbox_shift)
    
    # Initialize face parser
    fp = FaceParsing(
        left_cheek_width=args.left_cheek_width,
        right_cheek_width=args.right_cheek_width
    )
    
    i = 0
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
            print(f"Warning: Empty crop frame for bbox {bbox}, using a blank frame.")
            crop_frame = np.zeros((256, 256, 3), dtype=np.uint8)
        else:
            crop_frame = frame[y1:y2, x1:x2]
            crop_frame = cv2.resize(crop_frame,(256,256),interpolation = cv2.INTER_LANCZOS4)
        latents = vae.get_latents_for_unet(crop_frame)
        input_latent_list.append(latents)

    # to smooth the first and the last frame
    frame_list_cycle = frame_list + frame_list[::-1]
    coord_list_cycle = coord_list + coord_list[::-1]
    input_latent_list_cycle = input_latent_list + input_latent_list[::-1]
    
    ############################################## inference batch by batch ##############################################
    print("start inference")
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
        # Ensure latent_batch is consistent with model weight type
        latent_batch = latent_batch.to(dtype=weight_dtype)
        
        pred_latents = unet.model(latent_batch, timesteps, encoder_hidden_states=audio_feature_batch).sample
        recon = vae.decode_latents(pred_latents)
        for res_frame in recon:
            res_frame_list.append(res_frame)
            
    ############################################## pad to full image ##############################################
    print("pad talking image to original video")
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
        
        # Use v15 version blending
        combine_frame = get_image(ori_frame, res_frame, [x1, y1, x2, y2], mode=args.parsing_mode, fp=fp)
            
        if use_gfpgan and 'gfpganer' in globals() and gfpganer is not None:
            _, _, combine_frame = gfpganer.enhance(combine_frame, has_aligned=False, only_center_face=True, paste_back=True, weight=gfpgan_weight)

        cv2.imwrite(f"{result_img_save_path}/{str(i).zfill(8)}.png",combine_frame)
        
    # Output video path
    output_video = 'temp.mp4'

    # Read images
    def is_valid_image(file):
        pattern = re.compile(r'\d{8}\.png')
        return pattern.match(file)

    images = []
    files = [file for file in os.listdir(result_img_save_path) if is_valid_image(file)]
    files.sort(key=lambda x: int(x.split('.')[0]))

    for file in files:
        filename = os.path.join(result_img_save_path, file)
        images.append(imageio.imread(filename))
        

    # Save video
    imageio.mimwrite(output_video, images, 'FFMPEG', fps=fps, codec='libx264', pixelformat='yuv420p')

    input_video = './temp.mp4'
    # Check if the input_video and audio_path exist
    if not os.path.exists(input_video):
        raise FileNotFoundError(f"Input video file not found: {input_video}")
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")
    
    # Read video
    reader = imageio.get_reader(input_video)
    fps = reader.get_meta_data()['fps']  # Get original video frame rate
    reader.close() # Otherwise, error on win11: PermissionError: [WinError 32] Another program is using this file, process cannot access. : 'temp.mp4'
    # Store frames in list
    frames = images
    
    print(len(frames))

    # Load the video
    video_clip = VideoFileClip(input_video)

    # Load the audio
    audio_clip = AudioFileClip(audio_path)

    # Set the audio to the video
    video_clip = video_clip.set_audio(audio_clip)

    # Write the output video
    video_clip.write_videofile(output_vid_name, codec='libx264', audio_codec='aac',fps=25)

    os.remove("temp.mp4")
    #shutil.rmtree(result_img_save_path)
    print(f"result is save to {output_vid_name}")
    return output_vid_name,bbox_shift_text



# load model weights
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
vae, unet, pe = load_all_model(
    unet_model_path="./models/musetalkV15/unet.pth", 
    vae_type="sd-vae",
    unet_config="./models/musetalkV15/musetalk.json",
    device=device
)

# Initialize GFPGANer
try:
    from gfpgan import GFPGANer
    gfpganer = GFPGANer(
        model_path='https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth',
        upscale=1,
        arch='clean',
        channel_multiplier=2,
        bg_upsampler=None)
    print("GFPGAN initialized successfully.")
except ImportError:
    gfpganer = None
    print("GFPGAN not installed. Run `pip install gfpgan basicsr facexlib` to enable enhancement.")

# Parse command line arguments
parser = argparse.ArgumentParser()
parser.add_argument("--ffmpeg_path", type=str, default=r"ffmpeg-master-latest-win64-gpl-shared\bin", help="Path to ffmpeg executable")
parser.add_argument("--ip", type=str, default="127.0.0.1", help="IP address to bind to")
parser.add_argument("--port", type=int, default=7860, help="Port to bind to")
parser.add_argument("--share", action="store_true", help="Create a public link")
parser.add_argument("--use_float16", action="store_true", help="Use float16 for faster inference")
args = parser.parse_args()

# Set data type
if args.use_float16:
    # Convert models to half precision for better performance
    pe = pe.half()
    vae.vae = vae.vae.half()
    unet.model = unet.model.half()
    weight_dtype = torch.float16
else:
    weight_dtype = torch.float32

# Move models to specified device
pe = pe.to(device)
vae.vae = vae.vae.to(device)
unet.model = unet.model.to(device)

timesteps = torch.tensor([0], device=device)

# Initialize audio processor and Whisper model
audio_processor = AudioProcessor(feature_extractor_path="./models/whisper")
whisper = WhisperModel.from_pretrained("./models/whisper")
whisper = whisper.to(device=device, dtype=weight_dtype).eval()
whisper.requires_grad_(False)

from transformers import pipeline
# Load a tiny whisper model for automatic transcription
print("Loading Whisper-tiny for text transcription...")
transcriber = pipeline("automatic-speech-recognition", model="openai/whisper-tiny")

def transcribe_audio(audio_path):
    if not audio_path:
        return ""
    try:
        result = transcriber(audio_path)
        return result.get("text", "").strip()
    except Exception as e:
        print(f"Transcription error: {e}")
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
    if not fast_check_ffmpeg():
        print("Warning: Unable to find ffmpeg")
    avatar_id = str(uuid.uuid4())
    avatar_dir = os.path.join("./results/avatars", avatar_id)
    os.makedirs(avatar_dir, exist_ok=True)
    input_basename = os.path.basename(video_path).split('.')[0]
    with open(os.path.join(avatar_dir, "debug.log"), "w") as f:
        f.write(f"prepare_avatar started. video_path: {video_path}, type: {get_file_type(video_path)}\n")
        
    if get_file_type(video_path) == "video":
        with open(os.path.join(avatar_dir, "debug.log"), "a") as f:
            if not video_path.lower().endswith((".mp4", ".mov", ".avi", ".webm")):
                new_video_path = os.path.join(avatar_dir, f"{input_basename}.mp4")
                import shutil
                shutil.copyfile(video_path, new_video_path)
                video_path = new_video_path
                f.write(f"Renamed extensionless file to {video_path}\n")

            original_fps = get_video_fps(video_path)
            f.write(f"original_fps: {original_fps}\n")
            if abs(original_fps - 25) > 0.5:
                new_video_path = os.path.join(avatar_dir, f"{input_basename}_25fps.mp4")
                f.write(f"Running ffmpeg to convert to 25fps: {new_video_path}\n")
                subprocess.run(["ffmpeg", "-y", "-i", video_path, "-r", "25", new_video_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                video_path = new_video_path
                input_basename = f"{input_basename}_25fps"
                
        save_dir_full = os.path.join(avatar_dir, "full_imgs")
        os.makedirs(save_dir_full, exist_ok=True)
        
        with open(os.path.join(avatar_dir, "debug.log"), "a") as f:
            f.write(f"Calling imageio.get_reader on {video_path}\n")
            try:
                reader = imageio.get_reader(video_path, format='ffmpeg')
                frame_count = 0
                for i, im in enumerate(reader):
                    imageio.imwrite(f"{save_dir_full}/{i:08d}.png", im)
                    frame_count += 1
                f.write(f"Wrote {frame_count} frames to {save_dir_full}\n")
            except Exception as e:
                f.write(f"Exception reading frames: {e}\n")
                
            input_img_list = sorted(glob.glob(os.path.join(save_dir_full, '*.[jpJP][pnPN]*[gG]')))
            f.write(f"input_img_list length: {len(input_img_list)}\n")
            
        fps = get_video_fps(video_path)
    else: 
        input_img_list = glob.glob(os.path.join(video_path, '*.[jpJP][pnPN]*[gG]'))
        input_img_list = sorted(input_img_list, key=lambda x: int(os.path.splitext(os.path.basename(x))[0]))
        fps = args.fps
    coord_list, frame_list = get_landmark_and_bbox(input_img_list, bbox_shift)
    bbox_shift_text = get_bbox_range(input_img_list, bbox_shift)
    fp = FaceParsing(left_cheek_width=args.left_cheek_width, right_cheek_width=args.right_cheek_width)
    input_latent_list = []
    for bbox, frame in tqdm(zip(coord_list, frame_list), total=len(coord_list), desc="Preparing Avatar"):
        if bbox == coord_placeholder:
            if len(input_latent_list) > 0:
                input_latent_list.append(input_latent_list[-1])
            else:
                crop_frame = np.zeros((256, 256, 3), dtype=np.uint8)
                latents = vae.get_latents_for_unet(crop_frame)
                input_latent_list.append(latents)
            continue
        x1, y1, x2, y2 = bbox
        x1, y1 = max(0, int(x1)), max(0, int(y1))
        x2, y2 = min(frame.shape[1], int(x2)), min(frame.shape[0], int(y2) + args.extra_margin)
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
    with open(os.path.join(avatar_dir, 'coords.pkl'), 'wb') as f:
        pickle.dump(coord_list_cycle, f)
    torch.save(input_latent_list_cycle, os.path.join(avatar_dir, 'latents.pt'))
    with open(os.path.join(avatar_dir, 'frames.pkl'), 'wb') as f:
        pickle.dump(frame_list_cycle, f)
    meta = {"fps": fps, "args": args_dict, "bbox_shift_text": bbox_shift_text}
    with open(os.path.join(avatar_dir, 'meta.json'), 'w') as f:
        json.dump(meta, f)
    return avatar_id

@torch.no_grad()
def generate_from_avatar(avatar_id, audio_path, use_gfpgan=True, gfpgan_weight=0.5, progress=gr.Progress(track_tqdm=True)):
    try:
        avatar_dir = os.path.join("./results/avatars", avatar_id)
        if not os.path.exists(avatar_dir):
            raise FileNotFoundError(f"Avatar ID {avatar_id} not found.")
        with open(os.path.join(avatar_dir, 'meta.json'), 'r') as f:
            meta = json.load(f)
        fps = meta["fps"]
        args = Namespace(**meta["args"])
        with open(os.path.join(avatar_dir, 'coords.pkl'), 'rb') as f:
            coord_list_cycle = pickle.load(f)
        input_latent_list_cycle = torch.load(os.path.join(avatar_dir, 'latents.pt'))
        if len(input_latent_list_cycle) == 0:
            raise ValueError("The selected avatar is incomplete or failed to build. No faces were detected during preparation.")
        with open(os.path.join(avatar_dir, 'frames.pkl'), 'rb') as f:
            frame_list_cycle = pickle.load(f)
        fp = FaceParsing(left_cheek_width=args.left_cheek_width, right_cheek_width=args.right_cheek_width)
        whisper_input_features, librosa_length = audio_processor.get_audio_feature(audio_path)
        whisper_chunks = audio_processor.get_whisper_chunk(
            whisper_input_features, device, weight_dtype, whisper, librosa_length, fps=fps,
            audio_padding_length_left=args.audio_padding_length_left, audio_padding_length_right=args.audio_padding_length_right,
        )
        video_num = len(whisper_chunks)
        batch_size = args.batch_size
        gen = datagen(whisper_chunks=whisper_chunks, vae_encode_latents=input_latent_list_cycle, batch_size=batch_size, delay_frame=0, device=device)
        res_frame_list = []
        for i, (whisper_batch,latent_batch) in enumerate(tqdm(gen,total=int(np.ceil(float(video_num)/batch_size)))):
            audio_feature_batch = pe(whisper_batch)
            latent_batch = latent_batch.to(dtype=weight_dtype)
            pred_latents = unet.model(latent_batch, timesteps, encoder_hidden_states=audio_feature_batch).sample
            recon = vae.decode_latents(pred_latents)
            for res_frame in recon:
                res_frame_list.append(res_frame)
        temp_dir = os.path.join(avatar_dir, "output")
        os.makedirs(temp_dir, exist_ok=True)
        result_img_save_path = os.path.join(temp_dir, "frames")
        if os.path.exists(result_img_save_path):
            import shutil
            shutil.rmtree(result_img_save_path)
        os.makedirs(result_img_save_path, exist_ok=True)
        for i, res_frame in enumerate(tqdm(res_frame_list)):
            bbox = coord_list_cycle[i%(len(coord_list_cycle))]
            ori_frame = copy.deepcopy(frame_list_cycle[i%(len(frame_list_cycle))])
            if bbox == coord_placeholder:
                cv2.imwrite(f"{result_img_save_path}/{str(i).zfill(8)}.png", ori_frame)
                continue
                
            x1, y1, x2, y2 = bbox
            y2 = min(y2 + args.extra_margin, ori_frame.shape[0])
            try:
                res_frame = cv2.resize(res_frame.astype(np.uint8),(x2-x1,y2-y1))
            except:
                cv2.imwrite(f"{result_img_save_path}/{str(i).zfill(8)}.png", ori_frame)
                continue
            combine_frame = get_image(ori_frame, res_frame, [x1, y1, x2, y2], mode=args.parsing_mode, fp=fp)
            if use_gfpgan and 'gfpganer' in globals() and gfpganer is not None:
                _, _, combine_frame = gfpganer.enhance(combine_frame, has_aligned=False, only_center_face=True, paste_back=True, weight=gfpgan_weight)
            cv2.imwrite(f"{result_img_save_path}/{str(i).zfill(8)}.png",combine_frame)
        output_video = os.path.join(temp_dir, 'temp.mp4')
        images = []
        def is_valid_image(file):
            import re
            pattern = re.compile(r'\d{8}\.png')
            return pattern.match(file)
        files = [file for file in os.listdir(result_img_save_path) if is_valid_image(file)]
        files.sort(key=lambda x: int(x.split('.')[0]))
        for file in files:
            images.append(imageio.imread(os.path.join(result_img_save_path, file)))
        imageio.mimwrite(output_video, images, 'FFMPEG', fps=fps, codec='libx264', pixelformat='yuv420p')
        audio_basename = os.path.basename(audio_path).split('.')[0]
        final_output = os.path.join(temp_dir, f"final_{audio_basename}.mp4")
        video_clip = VideoFileClip(output_video)
        audio_clip = AudioFileClip(audio_path)
        video_clip = video_clip.set_audio(audio_clip)
        video_clip.write_videofile(final_output, codec='libx264', audio_codec='aac',fps=25)
        os.remove(output_video)
        return final_output
    except Exception as e:
        import traceback
        with open("error.log", "w") as f:
            f.write(traceback.format_exc())
        raise e


def check_video(video):
    if not isinstance(video, str):
        return video # in case of none type
    # Define the output video file name
    dir_path, file_name = os.path.split(video)
    if file_name.startswith("outputxxx_"):
        return video
    # Add the output prefix to the file name
    output_file_name = "outputxxx_" + file_name

    os.makedirs('./results',exist_ok=True)
    os.makedirs('./results/output',exist_ok=True)
    os.makedirs('./results/input',exist_ok=True)

    # Combine the directory path and the new file name
    output_video = os.path.join('./results/input', output_file_name)


    # read video
    reader = imageio.get_reader(video)
    fps = reader.get_meta_data()['fps']  # get fps from original video

    # conver fps to 25
    frames = [im for im in reader]
    target_fps = 25
    
    L = len(frames)
    L_target = int(L / fps * target_fps)
    original_t = [x / fps for x in range(1, L+1)]
    t_idx = 0
    target_frames = []
    for target_t in range(1, L_target+1):
        while target_t / target_fps > original_t[t_idx]:
            t_idx += 1      # find the first t_idx so that target_t / target_fps <= original_t[t_idx]
            if t_idx >= L:
                break
        target_frames.append(frames[t_idx])

    # save video
    imageio.mimwrite(output_video, target_frames, 'FFMPEG', fps=25, codec='libx264', quality=9, pixelformat='yuv420p')
    return output_video




css = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

#input_img {max-width: 1024px !important} 
#output_vid {max-width: 1024px; max-height: 576px}

body, .gradio-container {
    font-family: 'Inter', sans-serif !important;
    background-color: #0a0a0a !important; /* Main workspace canvas background */
}

/* Hide Gradio Branding */
footer { display: none !important; }

/* Dashboard Panels */
.dashboard-panel {
    background: #181818 !important;
    border-radius: 12px !important;
    border: 1px solid #2a2a2a !important;
    padding: 15px !important;
    height: 100% !important;
}

#header-bar {
    background: #181818 !important;
    border-bottom: 1px solid #2a2a2a !important;
    padding: 8px 15px !important;
    margin-bottom: 10px !important;
    display: flex;
    align-items: center;
}

#icon-sidebar {
    background: #181818 !important;
    border-left: 1px solid #2a2a2a !important;
    border-radius: 0 !important;
    padding: 10px 0 !important;
    text-align: center;
}
.sidebar-btn {
    background: transparent !important;
    border: none !important;
    color: #888 !important;
    font-size: 14px !important;
    margin-bottom: 15px !important;
    box-shadow: none !important;
}
.sidebar-btn:hover {
    color: #fff !important;
}

/* Script Textarea styling */
#script-area textarea {
    background: transparent !important;
    border: none !important;
    color: #ededed !important;
    font-size: 14px !important;
    min-height: 150px !important;
}

/* Timeline */
#timeline-panel {
    background: #181818 !important;
    border-radius: 12px !important;
    border: 1px solid #2a2a2a !important;
    padding: 10px !important;
    margin-top: 10px !important;
}

/* Sliders and Toggles */
input[type='range']::-webkit-slider-thumb {
    background: #00d2ff !important;
}
input[type='radio']:checked + span {
    background: #00d2ff !important;
    border-color: #00d2ff !important;
}

/* Specific button styles */
#primary-action-btn {
    background: #00d2ff !important;
    color: #000 !important;
    font-weight: 600 !important;
    border: none !important;
    border-radius: 20px !important;
}
"""

theme = gr.themes.Base(
    primary_hue="cyan",
    secondary_hue="slate",
    neutral_hue="slate",
    font=[gr.themes.GoogleFont("Inter"), "sans-serif"]
).set(
    body_background_fill="#0a0a0a",
    body_text_color="#ededed",
    body_text_color_subdued="#888888",
    background_fill_primary="#181818",
    background_fill_secondary="#0a0a0a",
    border_color_primary="#2a2a2a",
    border_color_accent="#00d2ff",
    block_background_fill="#181818",
    block_border_width="1px",
    block_label_background_fill="#181818",
    block_label_text_color="#ededed",
    block_title_text_color="#ededed",
    input_background_fill="#121212",
    input_border_color="#333333",
    button_primary_background_fill="#00d2ff",
    button_primary_text_color="#000000",
    button_secondary_background_fill="#222222",
    button_secondary_text_color="#ededed",
    button_secondary_border_color="#333333",
    panel_background_fill="#181818",
    slider_color="#00d2ff",
    accordion_text_color="#ededed"
)

with gr.Blocks(theme=theme, css=css, title="AI Video Studio") as demo:
    # 1. Top Bar
    with gr.Row(elem_id="header-bar"):
        with gr.Column(scale=4):
            gr.Markdown("#### 🔵 Home | &nbsp;&nbsp; ≡ &nbsp;&nbsp; 1 🔲 💻 &nbsp;&nbsp; ↩️ ↪️")
        with gr.Column(scale=4):
            gr.Markdown("<div style='text-align:center;'>⚪ Brand System</div>")
        with gr.Column(scale=4, min_width=200):
            with gr.Row():
                btn = gr.Button("✨ Generate", variant="primary", elem_id="primary-action-btn")
                gr.Button("Ask Orby", variant="secondary")
                gr.Button("👤", variant="secondary")
                
    # Main 4-Column Structure
    with gr.Row():
        
        # COLUMN 1: Left Panel (Script & Audio)
        with gr.Column(scale=3, min_width=300, elem_classes="dashboard-panel"):
            gr.Markdown("#### Script &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⌨️ 📄")
            script_text = gr.Textbox(value="LPG shortage in India? Reports of supply concerns are creating uncertainty. What's really happening, and should consumers be worried? Let's break down the facts in under a minute.", lines=8, show_label=False, elem_id="script-area")
            gr.Markdown("▶ Delivery style ⌄ &nbsp;&nbsp; ✨ Improved")
            audio = gr.Audio(label="Driving Audio", type="filepath")
            with gr.Row():
                gr.Button("+ Add scene", variant="secondary")
                gr.Button("🎤", variant="secondary", size="sm")

        # COLUMN 2: Center Canvas (Video & Timeline)
        with gr.Column(scale=5, min_width=450):
            with gr.Tabs():
                with gr.TabItem("Canvas"):
                    video = gr.Video(label="Reference Video", sources=['upload'])
                with gr.TabItem("Result"):
                    out1 = gr.Video(label="Output")
            
            # Timeline Panel
            with gr.Row(elem_id="timeline-panel"):
                gr.Markdown("▶ 00:00 / 00:10 &nbsp;&nbsp; 1x ⌄ &nbsp;&nbsp; 🔊")
                gr.Markdown("🖼️ +")
                
        # COLUMN 3: Right Panel (Settings)
        with gr.Column(scale=3, min_width=300, elem_classes="dashboard-panel"):
            gr.Markdown("#### Avatar & Voice (Scene 1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ✕")
            
            with gr.Group():
                gr.Markdown("**Avatar**\n\n👤 **Ashiesh**\nMan in light blue sweater &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; >")
            
            with gr.Group():
                gr.Markdown("**Voice**\n\n▶ Hallmark Treasor")
                
            with gr.Accordion("Motion Engine", open=True):
                gr.Markdown("🔮 Avatar V ⌄ &nbsp;&nbsp; ⚙️")
                bbox_shift = gr.Number(label="BBox Shift Value", value=0)
            
            with gr.Group():
                gr.Markdown("**Avatar Background**")
                with gr.Row():
                    gr.Button("🔲\nCustomize", variant="secondary")
                    gr.Button("👤\nRemove", variant="secondary")
                    gr.Button("🟦\nColor", variant="secondary")
                
            with gr.Group():
                gr.Markdown("**Layout**")
                with gr.Row():
                    gr.Button("Original", variant="primary")
                    gr.Button("Circle", variant="secondary")
                    
            with gr.Accordion("Face Parameters", open=True):
                parsing_mode = gr.Radio(label="Parsing Mode", choices=["jaw", "raw"], value="jaw")
                extra_margin = gr.Slider(label="Radius", minimum=0, maximum=40, value=0, step=1)
                left_cheek_width = gr.Slider(label="Zoom", minimum=20, maximum=160, value=100, step=5)
                right_cheek_width = gr.Slider(label="Right Cheek (Debug)", minimum=20, maximum=160, value=90, step=5)
                use_gfpgan = gr.Checkbox(label="Use GFPGAN Enhancement", value=True)
                gfpgan_weight = gr.Slider(label="GFPGAN Weight (Lower = less comic/smoother, Higher = sharper)", minimum=0.0, maximum=1.0, value=0.5, step=0.1)
                
            bbox_shift_scale = gr.Textbox(label="Status", value="✓ Scene rendered", interactive=False)
            debug_btn = gr.Button("Test Render (First Frame)", variant="secondary")
            
            with gr.Accordion("Debug Data", open=False):
                debug_image = gr.Image(label="Test Inpainting Result")
                debug_info = gr.Textbox(label="Test Information", lines=2, interactive=False)

        # COLUMN 4: Far Right Sidebar (Icons)
        with gr.Column(scale=1, min_width=60, elem_id="icon-sidebar"):
            gr.Button("👤\nAvatar", elem_classes="sidebar-btn")
            gr.Button("✨\nAI tools", elem_classes="sidebar-btn")
            gr.Button("🖼️\nMedia", elem_classes="sidebar-btn")
            gr.Button("💠\nElements", elem_classes="sidebar-btn")
            gr.Button("🎵\nMusic", elem_classes="sidebar-btn")
            gr.Button("💬\nCaptions", elem_classes="sidebar-btn")
            gr.Button("⏺️\nScreen Recorder", elem_classes="sidebar-btn")
            gr.Button("📑\nTemplates", elem_classes="sidebar-btn")
            gr.Button("📚\nLayers", elem_classes="sidebar-btn")
            gr.Button("🔄\nInteractivity", elem_classes="sidebar-btn")

    video.change(
        fn=check_video, inputs=[video], outputs=[video]
    )
    btn.click(
        fn=inference,
        inputs=[
            audio,
            video,
            bbox_shift,
            extra_margin,
            parsing_mode,
            left_cheek_width,
            right_cheek_width,
            use_gfpgan,
            gfpgan_weight
        ],
        outputs=[out1, bbox_shift_scale],
        api_name="inference"
    )
    debug_btn.click(
        fn=debug_inpainting,
        inputs=[
            video,
            bbox_shift,
            extra_margin,
            parsing_mode,
            left_cheek_width,
            right_cheek_width
        ],
        outputs=[debug_image, debug_info]
    )

    # Hidden buttons for new split APIs
    avatar_id_output = gr.Textbox(visible=False)
    prepare_btn = gr.Button("Prepare Avatar", visible=False)
    prepare_btn.click(
        fn=prepare_avatar,
        inputs=[
            video,
            bbox_shift,
            extra_margin,
            parsing_mode,
            left_cheek_width,
            right_cheek_width
        ],
        outputs=[avatar_id_output],
        api_name="prepare_avatar"
    )

    generate_btn = gr.Button("Generate from Avatar", visible=False)
    generate_btn.click(
        fn=generate_from_avatar,
        inputs=[
            avatar_id_output,
            audio,
            use_gfpgan,
            gfpgan_weight
        ],
        outputs=[out1],
        api_name="generate_from_avatar"
    )

    # Hidden button for API transcription
    transcribe_btn = gr.Button("Transcribe", visible=False)
    transcribe_btn.click(
        fn=transcribe_audio,
        inputs=[audio],
        outputs=[script_text],
        api_name="transcribe"
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
        debug=True,
    )
