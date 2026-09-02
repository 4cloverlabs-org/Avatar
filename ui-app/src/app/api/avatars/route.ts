import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('video') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No video file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uuid = crypto.randomUUID();
    const avatarDir = path.join(process.cwd(), '..', 'results', 'avatars', uuid);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(avatarDir)) {
      fs.mkdirSync(avatarDir, { recursive: true });
    }
    
    // Save video temporarily
    const tempVideoPath = path.join(avatarDir, 'temp_upload.webm');
    fs.writeFileSync(tempVideoPath, buffer);
    
    // Normalize to 25fps standard mp4
    const videoPath = path.join(avatarDir, 'video.mp4');
    const { execSync } = require('child_process');
    try {
      execSync(`ffmpeg -y -i "${tempVideoPath}" -r 25 -c:v libx264 -c:a aac "${videoPath}"`, { stdio: 'ignore' });
    } catch (e) {
      console.error("FFmpeg conversion failed, falling back to original file:", e);
      fs.renameSync(tempVideoPath, videoPath);
    }
    
    if (fs.existsSync(tempVideoPath)) {
      try { fs.unlinkSync(tempVideoPath); } catch(e) {}
    }
    
    let avatarCount = 0;
    try {
      const dirs = fs.readdirSync(path.join(process.cwd(), '..', 'results', 'avatars'));
      avatarCount = dirs.length;
    } catch (e) {}

    // Create meta.json
    const meta = { 
      id: uuid,
      name: `Untitled ${avatarCount + 1}`,
      createdAt: new Date().toISOString(),
      source: file.name,
      status: 'processing'
    };
    
    fs.writeFileSync(path.join(avatarDir, 'meta.json'), JSON.stringify(meta, null, 2));

    return NextResponse.json({ success: true, avatarId: uuid });
  } catch (error: any) {
    console.error("API Route Error (POST):", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const avatarsDir = path.join(process.cwd(), '..', 'results', 'avatars');
    if (!fs.existsSync(avatarsDir)) {
      return NextResponse.json({ success: true, avatars: [] });
    }
    
    const dirs = fs.readdirSync(avatarsDir).filter(f => fs.statSync(path.join(avatarsDir, f)).isDirectory());
    
    // Check which ones have meta.json to ensure they are fully built
    const completedAvatars = dirs.filter(d => fs.existsSync(path.join(avatarsDir, d, 'meta.json')));
    
    const avatarData = [];
    
    for (const id of completedAvatars) {
      const metaPath = path.join(avatarsDir, id, 'meta.json');
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        
        // Skip if this is actually a generated video (they have 'fps' and 'args' instead of 'name'/'status')
        if (!meta.name && !meta.status && meta.fps !== undefined) {
          continue;
        }
        
        const name = meta.name || id;
        const status = meta.status || 'ready';
        const progress = meta.progress !== undefined ? meta.progress : 0;
        
        avatarData.push({ id, name, status, progress });
      } catch (e) {
        // If meta.json is invalid, we can still include it as a fallback or skip it.
        // Let's include it just in case it's a corrupted avatar.
        avatarData.push({ id, name: id, status: 'ready', progress: 0 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      avatars: avatarData 
    });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
