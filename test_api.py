from gradio_client import Client, handle_file

client = Client("http://127.0.0.1:7860")
try:
    result = client.predict(
        "/Users/sohith/Desktop/Avatar/results/avatars/573be9be-9111-43c4-96c8-f9924d4c9b2d/video.mp4",
        0, 10, "jaw", 90, 90,
        api_name="/prepare_avatar"
    )
    print("Result:", result)
except Exception as e:
    print("Error:", e)
