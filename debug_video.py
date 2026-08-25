import os
import sys
import imageio
from musetalk.utils.utils import get_file_type, get_video_fps
import glob

video_path = r"F:\MuseTalk\results\avatars\5024797d-626b-4d94-95ac-965d7b771d38\video.mp4"
avatar_dir = "./results/avatars/debug_test"
os.makedirs(avatar_dir, exist_ok=True)
save_dir_full = os.path.join(avatar_dir, "full_imgs")
os.makedirs(save_dir_full, exist_ok=True)

print(f"type: {get_file_type(video_path)}")
reader = imageio.get_reader(video_path)
frame_count = 0
for i, im in enumerate(reader):
    imageio.imwrite(f"{save_dir_full}/{i:08d}.png", im)
    frame_count += 1
print(f"Wrote {frame_count} frames to {save_dir_full}")

input_img_list = sorted(glob.glob(os.path.join(save_dir_full, '*.[jpJP][pnPN]*[gG]')))
print(f"input_img_list length: {len(input_img_list)}")
