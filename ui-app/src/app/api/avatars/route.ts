import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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
    
    // Save video
    const videoPath = path.join(avatarDir, 'video.mp4');
    fs.writeFileSync(videoPath, buffer);
    
    // Create meta.json
    const meta = { 
      id: uuid,
      name: `Custom Avatar ${uuid.substring(0, 4)}`,
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
    
    const avatarData = completedAvatars.map(id => {
      const metaPath = path.join(avatarsDir, id, 'meta.json');
      let name = 'Custom Avatar';
      let status = 'ready';
      let progress = 0;
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        if (meta.name) {
          name = meta.name;
        } else {
          name = id;
        }
        if (meta.status) {
          status = meta.status;
        }
        if (meta.progress !== undefined) {
          progress = meta.progress;
        }
      } catch (e) {
        name = id;
      }
      return { id, name, status, progress };
    });

    return NextResponse.json({ 
      success: true, 
      avatars: avatarData 
    });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
