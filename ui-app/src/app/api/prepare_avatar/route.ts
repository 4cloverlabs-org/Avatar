import { NextResponse } from 'next/server';
import { Client, handle_file } from '@gradio/client';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const bboxShift = Number(formData.get('bboxShift')) || 0;
    const extraMargin = Number(formData.get('extraMargin')) || 10;
    const parsingMode = (formData.get('parsingMode') as string) || 'jaw';
    const leftCheekWidth = Number(formData.get('leftCheekWidth')) || 90;
    const rightCheekWidth = Number(formData.get('rightCheekWidth')) || 90;

    if (!videoFile) {
      return NextResponse.json({ success: false, error: "Video file is required." }, { status: 400 });
    }

    console.log("Connecting to Gradio Python Backend for avatar preparation...");
    const client = await Client.connect("http://127.0.0.1:7860");
    
    console.log("Running prepare_avatar task...");
    
    const result = await client.predict("/prepare_avatar", [ 
      { video: handle_file(videoFile) },
      bboxShift,
      extraMargin,
      parsingMode,
      leftCheekWidth,
      rightCheekWidth
    ]);

    console.log("Avatar preparation complete!", result.data);
    
    return NextResponse.json({ 
      success: true, 
      avatarId: (result.data as any)[0] 
    });
    
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to prepare avatar" }, { status: 500 });
  }
}
