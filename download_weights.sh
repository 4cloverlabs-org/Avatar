#!/bin/bash

# Set the checkpoints directory
CheckpointsDir="models"

# Create necessary directories
mkdir -p models/musetalk models/musetalkV15 models/syncnet models/dwpose models/face-parse-bisent models/sd-vae models/whisper

# Install required packages
pip install -U "huggingface_hub[cli]"
pip install gdown



# Download MuseTalk V1.0 weights
hf download TMElyralab/MuseTalk musetalk/musetalk.json musetalk/pytorch_model.bin \
  --local-dir $CheckpointsDir

# Download MuseTalk V1.5 weights (unet.pth)
hf download TMElyralab/MuseTalk musetalkV15/musetalk.json musetalkV15/unet.pth \
  --local-dir $CheckpointsDir

# Download SD VAE weights
hf download stabilityai/sd-vae-ft-mse config.json diffusion_pytorch_model.bin \
  --local-dir $CheckpointsDir/sd-vae

# Download Whisper weights
hf download openai/whisper-tiny config.json pytorch_model.bin preprocessor_config.json \
  --local-dir $CheckpointsDir/whisper

# Download DWPose weights
hf download yzd-v/DWPose dw-ll_ucoco_384.pth \
  --local-dir $CheckpointsDir/dwpose

# Download SyncNet weights
hf download ByteDance/LatentSync latentsync_syncnet.pt \
  --local-dir $CheckpointsDir/syncnet

# Download Face Parse Bisent weights
gdown 154JgKpzCPW82qINcVieuPH3fZ2e0P812 -O $CheckpointsDir/face-parse-bisent/79999_iter.pth
curl -L https://download.pytorch.org/models/resnet18-5c106cde.pth \
  -o $CheckpointsDir/face-parse-bisent/resnet18-5c106cde.pth

echo "✅ All weights have been downloaded successfully!" 
