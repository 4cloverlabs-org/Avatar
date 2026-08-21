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
    
    return NextResponse.json({ 
      success: true, 
      avatars: completedAvatars 
    });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
