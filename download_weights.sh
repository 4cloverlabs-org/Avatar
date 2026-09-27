#!/bin/bash
set -e

# Set the checkpoints directory
CheckpointsDir="models"

# Create necessary directories
mkdir -p models/musetalk models/musetalkV15 models/syncnet models/dwpose models/face-parse-bisent models/sd-vae models/whisper

# Install required packages
pip install -U "huggingface_hub[cli]"
pip install gdown



# Download MuseTalk V1.0 weights
python -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='TMElyralab/MuseTalk', allow_patterns=['musetalk/musetalk.json', 'musetalk/pytorch_model.bin'], local_dir='$CheckpointsDir')"

# Download MuseTalk V1.5 weights (unet.pth)
python -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='TMElyralab/MuseTalk', allow_patterns=['musetalkV15/musetalk.json', 'musetalkV15/unet.pth'], local_dir='$CheckpointsDir')"

# Download SD VAE weights
python -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='stabilityai/sd-vae-ft-mse', allow_patterns=['config.json', 'diffusion_pytorch_model.bin'], local_dir='$CheckpointsDir/sd-vae')"

# Download Whisper weights
python -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='openai/whisper-tiny', allow_patterns=['config.json', 'pytorch_model.bin', 'preprocessor_config.json'], local_dir='$CheckpointsDir/whisper')"

# Download DWPose weights
python -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='yzd-v/DWPose', allow_patterns=['dw-ll_ucoco_384.pth'], local_dir='$CheckpointsDir/dwpose')"

# Download SyncNet weights
python -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='ByteDance/LatentSync', allow_patterns=['latentsync_syncnet.pt'], local_dir='$CheckpointsDir/syncnet')"

# Download Face Parse Bisent weights
gdown 154JgKpzCPW82qINcVieuPH3fZ2e0P812 -O $CheckpointsDir/face-parse-bisent/79999_iter.pth
curl -L https://download.pytorch.org/models/resnet18-5c106cde.pth \
  -o $CheckpointsDir/face-parse-bisent/resnet18-5c106cde.pth

echo "✅ All weights have been downloaded successfully!" 
