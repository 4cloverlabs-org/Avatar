import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        if (meta.name) {
          name = meta.name;
        } else {
          name = id;
        }
      } catch (e) {
        name = id;
      }
      return { id, name };
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
