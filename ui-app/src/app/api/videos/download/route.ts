import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');
  const quality = searchParams.get('quality'); // 'original', '720p', '1080p', '4k'

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  let filePath = path.join(process.cwd(), 'public', 'videos', filename);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), '..', 'results', 'output', filename);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  }

  const stat = fs.statSync(filePath);
  const headers = new Headers();
  
  const outputFilename = (!quality || quality === 'original') ? filename : `${filename.replace('.mp4', '')}_${quality}.mp4`;
  headers.set('Content-Disposition', `attachment; filename="${outputFilename}"`);
  headers.set('Content-Type', 'video/mp4');

  if (!quality || quality === 'original') {
    headers.set('Content-Length', stat.size.toString());
    const fileStream = fs.createReadStream(filePath);
    // @ts-ignore
    return new NextResponse(Readable.toWeb(fileStream), { headers });
  }

  let height = '720';
  if (quality === '1080p') height = '1080';
  if (quality === '4k') height = '2160';

  const stream = new ReadableStream({
    start(controller) {
      const ffmpeg = spawn('ffmpeg', [
        '-i', filePath,
        '-vf', `scale=-2:${height}`,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-c:a', 'aac',
        '-f', 'mp4',
        '-movflags', 'frag_keyframe+empty_moov',
        'pipe:1'
      ]);

      ffmpeg.stdout.on('data', (chunk) => {
        controller.enqueue(chunk);
      });

      ffmpeg.stderr.on('data', (data) => {
        // Un-comment to debug ffmpeg locally
        // console.log(`ffmpeg stderr: ${data}`);
      });

      ffmpeg.on('close', (code) => {
        if (code !== 0) {
          console.error(`ffmpeg process exited with code ${code}`);
        }
        controller.close();
      });

      ffmpeg.on('error', (err) => {
        console.error('Failed to start ffmpeg (Make sure it is installed):', err);
        controller.error(err);
      });
    }
  });

  return new NextResponse(stream, { headers });
}
