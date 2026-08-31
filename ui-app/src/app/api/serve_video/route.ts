import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const relPath = searchParams.get('path');

    if (!type || !relPath) {
      return new NextResponse('Missing parameters', { status: 400 });
    }

    // Prevent directory traversal
    if (relPath.includes('..')) {
      return new NextResponse('Invalid path', { status: 400 });
    }

    let filePath = '';
    
    if (type === 'gen') {
      filePath = path.join(process.cwd(), '..', 'results', 'output', relPath);
    } else if (type === 'av') {
      filePath = path.join(process.cwd(), '..', 'results', 'avatars', relPath);
    } else if (type === 'trash') {
      filePath = path.join(process.cwd(), '..', 'results', 'trash', relPath);
    } else {
      return new NextResponse('Invalid type', { status: 400 });
    }

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    // If the path is a directory (e.g. an Avatar trash item), find the preview video inside it
    if (fs.statSync(filePath).isDirectory()) {
      const files = fs.readdirSync(filePath);
      const videoFile = files.find(f => f === 'preview_ai.mp4') || files.find(f => f.endsWith('.mp4'));
      if (videoFile) {
        filePath = path.join(filePath, videoFile);
      } else {
        return new NextResponse('No video found in directory', { status: 404 });
      }
    }

    const stat = fs.statSync(filePath);
    const fileStream = fs.createReadStream(filePath);
    
    // @ts-ignore
    const stream = Readable.toWeb(fileStream);

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': stat.size.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
    });

  } catch (error) {
    console.error('Error serving video:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
