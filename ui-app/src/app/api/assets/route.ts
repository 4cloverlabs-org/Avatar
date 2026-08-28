import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');

function ensureDir() {
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }
}

// Format size helper
function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Get file type helper
function getFileType(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['mp4', 'mov', 'avi', 'webm'].includes(ext || '')) return 'video';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) return 'image';
  if (['mp3', 'wav', 'ogg'].includes(ext || '')) return 'audio';
  return 'other';
}

export async function GET() {
  try {
    ensureDir();
    const files = fs.readdirSync(ASSETS_DIR);
    
    const assets = files.map((file, index) => {
      const stats = fs.statSync(path.join(ASSETS_DIR, file));
      return {
        id: `asset-${index}`,
        type: getFileType(file),
        name: file,
        size: formatBytes(stats.size),
        date: stats.mtime.toLocaleDateString(),
        timestamp: stats.mtime.getTime(),
        url: `/assets/${file}`
      };
    });

    // Sort newest first
    assets.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({ success: true, assets });
  } catch (error) {
    console.error('Error listing assets:', error);
    return NextResponse.json({ success: false, error: 'Failed to list assets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDir();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Safely format filename to avoid spaces and weird characters
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = path.join(ASSETS_DIR, safeName);
    
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ success: true, filename: safeName, url: `/assets/${safeName}` });
  } catch (error) {
    console.error('Error saving asset:', error);
    return NextResponse.json({ success: false, error: 'Failed to save asset' }, { status: 500 });
  }
}
