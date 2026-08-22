import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const resultsDir = path.join(process.cwd(), '..', 'results', 'output');
    if (!fs.existsSync(resultsDir)) {
      return NextResponse.json({ success: true, videos: [] });
    }

    const files = fs.readdirSync(resultsDir);
    const videos = files
      .filter(file => file.endsWith('.mp4'))
      .map((file, index) => {
        const stats = fs.statSync(path.join(resultsDir, file));
        return {
          id: index + 1,
          filename: file,
          title: file.replace('_25fps.mp4', '').replace('.mp4', ''),
          edited: stats.mtime,
          sizeBytes: stats.size,
          status: 'PUBLISHED'
        };
      })
      .sort((a, b) => b.edited.getTime() - a.edited.getTime());

    return NextResponse.json({ success: true, videos });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
