import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const avatarsDir = path.join(process.cwd(), '..', 'results', 'avatars');
    const metaPath = path.join(avatarsDir, id, 'meta.json');
    
    if (!fs.existsSync(metaPath)) {
      return NextResponse.json({ success: false, error: "Avatar not found" }, { status: 404 });
    }
    
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    meta.name = body.name;
    
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    
    return NextResponse.json({ success: true, name: meta.name });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const avatarsDir = path.join(process.cwd(), '..', 'results', 'avatars');
    const targetDir = path.join(avatarsDir, id);
    
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const avatarsDir = path.join(process.cwd(), '..', 'results', 'avatars');
    const sourceDir = path.join(avatarsDir, id);
    
    if (!fs.existsSync(sourceDir)) {
      return NextResponse.json({ success: false, error: "Avatar not found" }, { status: 404 });
    }
    
    const newId = crypto.randomUUID();
    const targetDir = path.join(avatarsDir, newId);
    
    // Copy directory recursively
    fs.cpSync(sourceDir, targetDir, { recursive: true });
    
    // Update name in meta.json
    const metaPath = path.join(targetDir, 'meta.json');
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      meta.name = (meta.name || 'Custom Avatar') + ' (Copy)';
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    }
    
    return NextResponse.json({ success: true, newId });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
