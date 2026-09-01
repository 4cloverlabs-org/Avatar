import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { voice } from '../../../db/schema';
import { auth } from '../../../lib/auth';
import { headers } from 'next/headers';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const voices = await db.select()
      .from(voice)
      .where(eq(voice.userId, session.user.id))
      .orderBy(desc(voice.createdAt));

    return NextResponse.json({ success: true, voices });
  } catch (error: any) {
    console.error("GET /api/voices error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const audioFile = formData.get('audio') as File;

    if (!name || !audioFile) {
      return NextResponse.json({ success: false, error: 'Missing name or audio file' }, { status: 400 });
    }

    const voiceId = crypto.randomUUID();
    const voiceDir = path.join(process.cwd(), '..', 'results', 'voices', voiceId);
    
    // Create directory
    if (!fs.existsSync(voiceDir)) {
      fs.mkdirSync(voiceDir, { recursive: true });
    }

    // Save audio file
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const filePath = path.join(voiceDir, 'sample.wav');
    fs.writeFileSync(filePath, buffer);

    // Generate cloned preview audio
    try {
      const { Client } = await import('@gradio/client');
      console.log(`Generating preview for newly cloned voice ${voiceId}...`);
      const client = await Client.connect("http://127.0.0.1:7860");
      
      const previewText = "Hi! This is a cloned sample of my voice. I think it sounds pretty good!";
      const result = await client.predict("/generate_speech", [ 
        previewText,
        voiceId 
      ]);
      
      const outputString = result.data?.[0];
      if (typeof outputString === 'string' && !outputString.startsWith('Error:')) {
         let absolutePath = outputString;
         if (absolutePath.startsWith('./')) {
            absolutePath = path.join(process.cwd(), '..', absolutePath.substring(2));
         }
         fs.copyFileSync(absolutePath, path.join(voiceDir, 'preview.wav'));
      }
    } catch (err) {
      console.error("Failed to generate preview for voice", err);
    }

    // Save to DB
    const newVoice = await db.insert(voice).values({
      id: voiceId,
      userId: session.user.id,
      name,
      type: 'custom',
      samplePath: filePath,
    }).returning();

    return NextResponse.json({ success: true, voice: newVoice[0] });
  } catch (error: any) {
    console.error("POST /api/voices error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
