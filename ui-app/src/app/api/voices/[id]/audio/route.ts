import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { voice } from '../../../../../db/schema';
import { auth } from '../../../../../lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import fs from 'fs';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const voices = await db.select().from(voice).where(eq(voice.id, id));
    if (voices.length === 0) {
      return NextResponse.json({ success: false, error: 'Voice not found' }, { status: 404 });
    }

    const voiceRecord = voices[0];
    
    if (voiceRecord.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!voiceRecord.samplePath || !fs.existsSync(voiceRecord.samplePath)) {
       return NextResponse.json({ success: false, error: 'Audio file not found on disk' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(voiceRecord.samplePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error("GET /api/voices/[id]/audio error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
