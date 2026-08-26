import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request, { params }: { params: Promise<{ trashId: string }> }) {
  try {
    const { trashId } = await params;
    
    if (!trashId || trashId.includes('..')) {
      return NextResponse.json({ success: false, error: 'Invalid trash ID' }, { status: 400 });
    }

    const trashDir = path.join(process.cwd(), '..', 'results', 'trash');
    const sourcePath = path.join(trashDir, trashId);

    if (!fs.existsSync(sourcePath)) {
      return NextResponse.json({ success: false, error: 'Item not found in trash' }, { status: 404 });
    }

    const parts = trashId.split('___');
    if (parts.length !== 3) {
      return NextResponse.json({ success: false, error: 'Malformed trash ID' }, { status: 400 });
    }

    const type = parts[0];
    const originalId = parts[1];
    
    // Determine restore destination
    let destDir = '';
    if (type === 'avatar') {
      destDir = path.join(process.cwd(), '..', 'results', 'avatars');
    } else if (type === 'video') {
      destDir = path.join(process.cwd(), '..', 'results', 'output');
    } else {
      return NextResponse.json({ success: false, error: 'Unknown item type' }, { status: 400 });
    }
    
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const targetPath = path.join(destDir, originalId);
    
    // Restore
    fs.renameSync(sourcePath, targetPath);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Trash Restore Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ trashId: string }> }) {
  try {
    const { trashId } = await params;
    
    if (!trashId || trashId.includes('..')) {
      return NextResponse.json({ success: false, error: 'Invalid trash ID' }, { status: 400 });
    }

    const trashDir = path.join(process.cwd(), '..', 'results', 'trash');
    const targetPath = path.join(trashDir, trashId);

    if (fs.existsSync(targetPath)) {
      if (fs.statSync(targetPath).isDirectory()) {
        fs.rmSync(targetPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(targetPath);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Trash Delete Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
