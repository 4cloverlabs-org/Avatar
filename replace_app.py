import sys

with open(r"F:\MuseTalk\app.py", "r", encoding="utf-8") as f:
    content = f.read()

target = """    if get_file_type(video_path) == "video":
        with open(os.path.join(avatar_dir, "debug.log"), "a") as f:
            original_fps = get_video_fps(video_path)
            f.write(f"original_fps: {original_fps}\\n")
            if abs(original_fps - 25) > 0.5:
                new_video_path = os.path.join(avatar_dir, f"{input_basename}_25fps.mp4")
                f.write(f"Running ffmpeg to convert to 25fps: {new_video_path}\\n")
                subprocess.run(["ffmpeg", "-y", "-i", video_path, "-r", "25", new_video_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                video_path = new_video_path
                input_basename = f"{input_basename}_25fps"
                
        save_dir_full = os.path.join(avatar_dir, "full_imgs")
        os.makedirs(save_dir_full, exist_ok=True)"""

replacement = """    if get_file_type(video_path) == "video":
        with open(os.path.join(avatar_dir, "debug.log"), "a") as f:
            if not video_path.lower().endswith((".mp4", ".mov", ".avi", ".webm")):
                new_video_path = os.path.join(avatar_dir, f"{input_basename}.mp4")
                import shutil
                shutil.copyfile(video_path, new_video_path)
                video_path = new_video_path
                f.write(f"Renamed extensionless file to {video_path}\\n")

            original_fps = get_video_fps(video_path)
            f.write(f"original_fps: {original_fps}\\n")
            if abs(original_fps - 25) > 0.5:
                new_video_path = os.path.join(avatar_dir, f"{input_basename}_25fps.mp4")
                f.write(f"Running ffmpeg to convert to 25fps: {new_video_path}\\n")
                subprocess.run(["ffmpeg", "-y", "-i", video_path, "-r", "25", new_video_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                video_path = new_video_path
                input_basename = f"{input_basename}_25fps"
                
        save_dir_full = os.path.join(avatar_dir, "full_imgs")
        os.makedirs(save_dir_full, exist_ok=True)"""

if target in content:
    content = content.replace(target, replacement)
    with open(r"F:\MuseTalk\app.py", "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Target not found!")
