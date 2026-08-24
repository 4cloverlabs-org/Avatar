import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const avatarDir = path.join(process.cwd(), '..', 'results', 'avatars', id);
    
    if (!fs.existsSync(avatarDir)) {
      return new NextResponse('Not found', { status: 404 });
    }
    
    const files = fs.readdirSync(avatarDir);
    let videoFile = files.find(f => f === 'preview_ai.mp4');
    if (!videoFile) {
      videoFile = files.find(f => f.endsWith('.mp4'));
    }
    
    if (!videoFile) {
      return new NextResponse('No video found', { status: 404 });
    }
    
    const videoPath = path.join(avatarDir, videoFile);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const videoBuffer = fs.readFileSync(videoPath);
      const chunk = videoBuffer.subarray(start, end + 1);
      
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      return new NextResponse(chunk, { status: 206, headers: head as any });
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=86400'
      };
      const videoBuffer = fs.readFileSync(videoPath);
      return new NextResponse(videoBuffer, { status: 200, headers: head as any });
    }
  } catch (error: any) {
    console.error("Preview API Error:", error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
