import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

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
            status: 'PUBLISHED',
            url: `/api/serve_video?type=gen&path=${encodeURIComponent(file)}`
          };
        });
      allVideos = [...allVideos, ...generatedVideos];
    }

    // Check avatar outputs
    const avatarsDir = path.join(process.cwd(), '..', 'results', 'avatars');
    if (fs.existsSync(avatarsDir)) {
      const avatarDirs = fs.readdirSync(avatarsDir).filter(f => fs.statSync(path.join(avatarsDir, f)).isDirectory());
      avatarDirs.forEach((avatarId, aIndex) => {
        const avatarOutputDir = path.join(avatarsDir, avatarId, 'output');
        if (fs.existsSync(avatarOutputDir)) {
          const outputFiles = fs.readdirSync(avatarOutputDir);
          const avatarVideos = outputFiles
            .filter(file => file.endsWith('.mp4'))
            .map((file, fIndex) => {
              const stats = fs.statSync(path.join(avatarOutputDir, file));
              let avatarName = 'Custom Avatar';
              try {
                const meta = JSON.parse(fs.readFileSync(path.join(avatarsDir, avatarId, 'meta.json'), 'utf8'));
                if (meta.name) avatarName = meta.name;
              } catch(e) {}
              
              let friendlyTitle = file.replace('.mp4', '');
              if (file.startsWith('final_') || file === 'final.mp4') {
                friendlyTitle = `Video from ${avatarName}`;
              } else {
                friendlyTitle = friendlyTitle.replace('final_', 'Video ');
              }

              return {
                id: `av-${avatarId}-${fIndex}`,
                filename: `${avatarId}/output/${file}`,
                title: friendlyTitle,
                edited: stats.mtime,
                sizeBytes: stats.size,
                status: 'PUBLISHED',
                url: `/api/serve_video?type=av&path=${encodeURIComponent(avatarId + '/output/' + file)}`
              };
            });
          allVideos = [...allVideos, ...avatarVideos];
        }
      });
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
            status: 'UPLOADED',
            url: `/videos/${file}`
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
    const { filename, id, trash } = await request.json();
    let dir;
    let actualFilename = filename;
    
    if (id.startsWith('av-')) {
      dir = path.join(process.cwd(), '..', 'results', 'avatars');
    } else if (id.startsWith('gen-')) {
      dir = path.join(process.cwd(), '..', 'results', 'output');
    } else {
      dir = path.join(process.cwd(), 'public', 'videos');
    }
    
    const filePath = path.join(dir, actualFilename);
    if (fs.existsSync(filePath)) {
      if (trash) {
        const trashDir = path.join(process.cwd(), '..', 'results', 'trash');
        if (!fs.existsSync(trashDir)) {
          fs.mkdirSync(trashDir, { recursive: true });
        }
        
        // Format for the Trash UI: type___originalId___timestamp
        // We use a flat filename to prevent directory traversal issues on restore
        const flatOriginalId = `gen_${Date.now()}_${path.basename(actualFilename)}`;
        const trashFilename = `video___${flatOriginalId}___${Date.now()}`;
        const trashPath = path.join(trashDir, trashFilename);
        
        fs.renameSync(filePath, trashPath);
      } else {
        fs.unlinkSync(filePath);
      }
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
    let dir;
    let actualFilename = filename;
    
    if (id.startsWith('av-')) {
      dir = path.join(process.cwd(), '..', 'results', 'avatars');
    } else if (id.startsWith('gen-')) {
      dir = path.join(process.cwd(), '..', 'results', 'output');
    } else {
      dir = path.join(process.cwd(), 'public', 'videos');
    }
    
    const oldPath = path.join(dir, actualFilename);
    const ext = path.extname(actualFilename);
    // Only replace the actual file name part, preserving the directory structure for av- types
    const parsedPath = path.parse(actualFilename);
    const newFilenamePart = `${newTitle.replace(/[^a-zA-Z0-9_ -]/g, '_')}${ext}`;
    const newPath = path.join(dir, parsedPath.dir, newFilenamePart);
    
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      return NextResponse.json({ success: true, newFilename: path.join(parsedPath.dir, newFilenamePart).replace(/\\/g, '/') });
    }
    return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
