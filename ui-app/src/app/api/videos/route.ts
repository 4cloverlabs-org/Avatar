import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    let allVideos: any[] = [];

    // Check generated output directory
    const resultsDir = path.join(process.cwd(), '..', 'results', 'output');
    if (fs.existsSync(resultsDir)) {
      const resultFiles = fs.readdirSync(resultsDir);
      const generatedVideos = resultFiles
        .filter(file => file.endsWith('.mp4'))
        .map((file, index) => {
          const stats = fs.statSync(path.join(resultsDir, file));
          return {
            id: `gen-${index}`,
            filename: file,
            title: file.replace('_25fps.mp4', '').replace('.mp4', ''),
            edited: stats.mtime,
            sizeBytes: stats.size,
            status: 'PUBLISHED'
          };
        });
      allVideos = [...allVideos, ...generatedVideos];
    }

    // Check uploaded public directory
    const publicDir = path.join(process.cwd(), 'public', 'videos');
    if (fs.existsSync(publicDir)) {
      const publicFiles = fs.readdirSync(publicDir);
      const uploadedVideos = publicFiles
        .filter(file => file.endsWith('.mp4') || file.endsWith('.mov'))
        .map((file, index) => {
          const stats = fs.statSync(path.join(publicDir, file));
          return {
            id: `pub-${index}`,
            filename: file,
            title: file.replace('.mp4', '').replace('.mov', ''),
            edited: stats.mtime,
            sizeBytes: stats.size,
            status: 'UPLOADED'
          };
        });
      allVideos = [...allVideos, ...uploadedVideos];
    }

    // Sort all by date
    allVideos.sort((a, b) => b.edited.getTime() - a.edited.getTime());

    return NextResponse.json({ success: true, videos: allVideos });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { filename, id } = await request.json();
    const type = id.startsWith('gen') ? 'gen' : 'pub';
    const dir = type === 'gen' ? path.join(process.cwd(), '..', 'results', 'output') : path.join(process.cwd(), 'public', 'videos');
    const filePath = path.join(dir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { filename, id, newTitle } = await request.json();
    const type = id.startsWith('gen') ? 'gen' : 'pub';
    const dir = type === 'gen' ? path.join(process.cwd(), '..', 'results', 'output') : path.join(process.cwd(), 'public', 'videos');
    const oldPath = path.join(dir, filename);
    const ext = path.extname(filename);
    const newFilename = `${newTitle.replace(/[^a-zA-Z0-9_ -]/g, '_')}${ext}`;
    const newPath = path.join(dir, newFilename);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      return NextResponse.json({ success: true, newFilename });
    }
    return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
