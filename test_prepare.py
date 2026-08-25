import sys
import os

# Add MuseTalk to path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import prepare_avatar
video_path = r"F:\MuseTalk\results\avatars\5024797d-626b-4d94-95ac-965d7b771d38\video.mp4"
print(prepare_avatar(video_path, 0, 10, "jaw", 90, 90))
