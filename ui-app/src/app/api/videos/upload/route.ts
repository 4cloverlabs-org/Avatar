import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file to public/videos so the youtube uploader can find it
    const videoDir = path.join(process.cwd(), 'public', 'videos');
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }

    // Clean up filename to prevent issues
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const savePath = path.join(videoDir, sanitizedName);
    
    fs.writeFileSync(savePath, buffer);

    return NextResponse.json({ 
      success: true, 
      filename: sanitizedName,
      size: file.size
    });
  } catch (error: any) {
    console.error("Video Upload Error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
