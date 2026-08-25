import imageio
try:
    reader = imageio.get_reader(r"F:\MuseTalk\results\avatars\5024797d-626b-4d94-95ac-965d7b771d38\video.mp4", format='ffmpeg')
    print("SUCCESS: get_reader with format='ffmpeg' works!")
except Exception as e:
    print(f"FAILED: {e}")