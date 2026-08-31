import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const avatarId = url.searchParams.get('avatarId');
  const expectedAspect = url.searchParams.get('aspect') || '16/9';

  if (!avatarId) {
    return NextResponse.json({ success: false, error: "Missing avatarId" }, { status: 400 });
  }

  const [w, h] = expectedAspect.split('/');
  const expectedSuffix = `_${w}x${h}.mp4`;

  const outputDir = path.join(process.cwd(), '..', 'results', 'avatars', avatarId, 'output');
  if (fs.existsSync(outputDir)) {
    const files = fs.readdirSync(outputDir);
    
    // First, look for the accurately cropped aspect ratio file
    const croppedMp4 = files.find((f: string) => f.endsWith(expectedSuffix) && f.startsWith('final_'));
    if (croppedMp4) {
      const videoUrl = `/api/serve_video?type=av&path=${encodeURIComponent(avatarId + '/output/' + croppedMp4)}`;
      return NextResponse.json({ success: true, ready: true, url: videoUrl });
    }

    // Fallback: look for the raw file if cropping failed or hasn't happened yet
    const generatedMp4 = files.find((f: string) => f === 'final_blob.mp4');
    if (generatedMp4) {
      const stats = fs.statSync(path.join(outputDir, generatedMp4));
      // Give it 10 seconds to allow ffmpeg crop to run before returning the raw fallback
      if (Date.now() - stats.mtimeMs > 10000) {
        const videoUrl = `/api/serve_video?type=av&path=${encodeURIComponent(avatarId + '/output/' + generatedMp4)}`;
        return NextResponse.json({ success: true, ready: true, url: videoUrl });
      }
    }
  }

  return NextResponse.json({ success: true, ready: false });
}
