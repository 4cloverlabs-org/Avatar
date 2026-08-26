import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  
  if (!filename || filename.includes('..')) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  const filePath = path.join(process.cwd(), '..', 'results', 'output', filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Video not found', { status: 404 });
  }

  try {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const videoBuffer = fs.readFileSync(filePath);
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
      };
      const videoBuffer = fs.readFileSync(filePath);
      return new NextResponse(videoBuffer, { status: 200, headers: head as any });
    }
  } catch (error: any) {
    console.error("Videos API Error:", error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;
    
    if (!filename || filename.includes('..')) {
      return NextResponse.json({ success: false, error: 'Invalid filename' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), '..', 'results', 'output', filename);
    
    if (fs.existsSync(filePath)) {
      const trashDir = path.join(process.cwd(), '..', 'results', 'trash');
      if (!fs.existsSync(trashDir)) {
        fs.mkdirSync(trashDir, { recursive: true });
      }
      
      const timestamp = Date.now();
      const trashPath = path.join(trashDir, `video___${filename}___${timestamp}`);
      
      fs.renameSync(filePath, trashPath);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Video DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
