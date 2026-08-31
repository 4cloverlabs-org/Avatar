import { NextResponse } from 'next/server';
import { Client } from '@gradio/client';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const text = formData.get('text') as string;
    const voiceId = formData.get('voiceId') as string;

    if (!text || !voiceId) {
      return NextResponse.json({ success: false, error: "Text and Voice ID are required" }, { status: 400 });
    }

    console.log(`Connecting to Gradio to generate speech for voice ${voiceId}...`);
    const client = await Client.connect("http://127.0.0.1:7860");
    
    let result: any;
    try {
      result = await client.predict("/generate_speech", [ 
        text,
        voiceId
      ]);
    } catch (err: any) {
      console.error("Gradio prediction failed:", err);
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }

    const outputString = result.data?.[0];
    if (typeof outputString === 'string' && outputString.startsWith('Error:')) {
      return NextResponse.json({ success: false, error: outputString }, { status: 500 });
    }

    let absolutePath = typeof outputString === 'string' ? outputString : outputString?.path;
    console.log("Raw output from Gradio:", absolutePath);
    
    if (absolutePath && absolutePath.startsWith('./')) {
      // Resolve path from the backend root folder (one directory up from ui-app)
      absolutePath = path.join(process.cwd(), '..', absolutePath.substring(2));
    }
    
    console.log("Resolved absolute path:", absolutePath);
    
    if (!absolutePath || !fs.existsSync(absolutePath)) {
      console.error(`File does not exist: ${absolutePath}`);
      return NextResponse.json({ success: false, error: `Generated audio file not found at ${absolutePath}` }, { status: 500 });
    }

    const ttsBuffer = fs.readFileSync(absolutePath);

    return new NextResponse(ttsBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": 'attachment; filename="tts.wav"'
      }
    });

  } catch (error: any) {
    console.error("TTS API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
