import os
import torch
from TTS.api import TTS

try:
    print("Loading TTS model...")
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to("cpu")
    print("Generating speech...")
    tts.tts_to_file(
        text="Hello world, this is a test.",
        file_path="test.wav",
        speaker_wav="results/voices/8507f90c-88fd-41e1-b817-372ba5d96ea4/sample.wav",
        language="en"
    )
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
