import { NextResponse } from 'next/server';
import { Client } from '@gradio/client';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json({ success: false, error: "Audio file is required." }, { status: 400 });
    }

    console.log("Connecting to Gradio for transcription...");
    const client = await Client.connect("http://127.0.0.1:7860");
    
    console.log("Running whisper transcription...");
    const result = await client.predict("/transcribe", [ audioFile ]);

    console.log("Transcription complete:", result.data);
    
    return NextResponse.json({ 
      success: true, 
      text: (result.data as any)[0] 
    });
    
  } catch (error: any) {
    console.error("Transcription Route Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to transcribe audio" }, { status: 500 });
  }
}
