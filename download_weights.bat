@echo off
setlocal

:: Set the checkpoints directory
set CheckpointsDir=models

:: Create necessary directories
mkdir %CheckpointsDir%\musetalk
mkdir %CheckpointsDir%\musetalkV15
mkdir %CheckpointsDir%\syncnet
mkdir %CheckpointsDir%\dwpose
mkdir %CheckpointsDir%\face-parse-bisent
mkdir %CheckpointsDir%\sd-vae-ft-mse
mkdir %CheckpointsDir%\whisper

:: Install required packages
pip install -U "huggingface_hub[hf_xet]"

:: Set HuggingFace endpoint removed

:: Download MuseTalk weights
hf download TMElyralab/MuseTalk --local-dir %CheckpointsDir%

:: Download SD VAE weights
hf download stabilityai/sd-vae-ft-mse config.json diffusion_pytorch_model.bin --local-dir %CheckpointsDir%\sd-vae

:: Download Whisper weights
hf download openai/whisper-tiny config.json pytorch_model.bin preprocessor_config.json --local-dir %CheckpointsDir%\whisper

:: Download DWPose weights
hf download yzd-v/DWPose dw-ll_ucoco_384.pth --local-dir %CheckpointsDir%\dwpose

:: Download SyncNet weights
hf download ByteDance/LatentSync latentsync_syncnet.pt --local-dir %CheckpointsDir%\syncnet

:: Download face-parse-bisent weights
hf download ManyOtherFunctions/face-parse-bisent 79999_iter.pth resnet18-5c106cde.pth --local-dir %CheckpointsDir%\face-parse-bisent

echo All weights have been downloaded successfully!
endlocal 
