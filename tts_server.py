from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse
import uuid
import os
import shutil
from gradio_client import Client, handle_file

app = FastAPI()

# Note: The first request might take a bit longer if it needs to wake up the space.
print("Initializing Gradio Client for F5-TTS...")
try:
    client = Client("mrfakename/E2-F5-TTS")
except Exception as e:
    print(f"Warning: Could not initialize Gradio client: {e}")
    client = None

@app.post("/clone_voice")
async def clone_voice(
    text: str = Form(...),
    audio: UploadFile = File(...)
):
    try:
        if client is None:
            return JSONResponse(status_code=500, content={"error": "F5-TTS API client failed to initialize."})
            
        ref_id = str(uuid.uuid4())
        # Gradio client handles files automatically, but we need to save the upload locally first
        ref_path = f"temp_ref_{ref_id}.wav"
        
        with open(ref_path, "wb") as f:
            shutil.copyfileobj(audio.file, f)
            
        print(f"Sending audio to F5-TTS API...")
        
        # Call the HuggingFace space directly using gradio_client
        # Leaving ref_text as empty string '' forces it to auto-transcribe on their backend
        result = client.predict(
            ref_audio=handle_file(ref_path),
            ref_text="",
            gen_text=text,
            remove_silence=False,
            api_name="/predict"
        )
        
        # result is the path to the downloaded wav file in the gradio temp folder
        print(f"Received generated audio from F5-TTS: {result}")
        
        # Rename to a fixed path so we can clean up the temp ref
        final_output = f"final_output_tts_{ref_id}.wav"
        shutil.copy(result, final_output)
        
        # Clean up
        os.remove(ref_path)
        
        return FileResponse(final_output, media_type="audio/wav", filename="output_tts.wav")
        
    except Exception as e:
        print(f"Error during cloning: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8081)
