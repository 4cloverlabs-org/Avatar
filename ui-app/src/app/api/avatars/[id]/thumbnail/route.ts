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

    // Check if there is a video file first
    const files = fs.readdirSync(avatarDir);
    const videoFile = files.find(f => f.endsWith('.mp4'));
    if (videoFile) {
        // If there's a video, we don't necessarily have a thumbnail here unless we extract it.
        // We'll just return 404 to let the frontend know, or we could redirect to the preview.
        // But since this is for fallback, let's just try to serve a frame.
    }

    // Try to find a frame in full_imgs
    const fullImgsDir = path.join(avatarDir, 'full_imgs');
    if (fs.existsSync(fullImgsDir)) {
        const frames = fs.readdirSync(fullImgsDir).filter(f => f.endsWith('.png'));
        if (frames.length > 0) {
            const firstFramePath = path.join(fullImgsDir, frames[0]);
            const stat = fs.statSync(firstFramePath);
            const file = fs.readFileSync(firstFramePath);
            
            return new NextResponse(file, {
                headers: {
                'Content-Type': 'image/png',
                'Content-Length': stat.size.toString(),
                'Cache-Control': 'public, max-age=31536000',
                },
            });
        }
    }

    return new NextResponse('No thumbnail found', { status: 404 });
  } catch (error) {
    console.error('Error serving thumbnail:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
