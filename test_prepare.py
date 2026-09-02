import sys
import traceback

try:
    import app
    # Use a dummy video path. Wait, prepare_avatar expects a valid video!
    # Let's use the one we used before:
    video_path = "/Users/sohith/Desktop/Avatar/results/avatars/573be9be-9111-43c4-96c8-f9924d4c9b2d/video.mp4"
    print("Calling prepare_avatar directly...")
    result = app.prepare_avatar(video_path, 0, 10, "jaw", 90, 90)
    print("Result:", result)
except Exception as e:
    traceback.print_exc()
