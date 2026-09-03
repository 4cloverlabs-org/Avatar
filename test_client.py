from gradio_client import Client
import json

client = Client("http://127.0.0.1:7860")
try:
    result = client.predict(
        json.dumps(["Hello world"]), 
        "8507f90c-88fd-41e1-b817-372ba5d96ea4", 
        "bf8b0499-0534-4dc3-b680-b8756f834ed5", 
        "strat123", 
        "user123", 
        api_name="/generate_strategy_video"
    )
    print("Success:", result)
except Exception as e:
    print("Error:", str(e))
