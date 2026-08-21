import { NextResponse } from 'next/server';
import { Client, handle_file } from '@gradio/client';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const avatarId = formData.get('avatarId') as string;
    const audioFile = formData.get('audio') as File;

    if (!avatarId || !audioFile) {
      return NextResponse.json({ success: false, error: "Avatar ID and Audio file are required." }, { status: 400 });
    }

    console.log(`Connecting to Gradio for generation using Avatar ${avatarId}...`);
    const client = await Client.connect("http://127.0.0.1:7860");
    
    console.log("Running generate_from_avatar task...");
    
    const result = await client.predict("/generate_from_avatar", [ 
      avatarId,
      handle_file(audioFile),
      true, 
      1.0   
    ]);

    console.log("Generation complete!", result.data);
    
    return NextResponse.json({ 
      success: true, 
      data: result.data 
    });
    
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to generate video" }, { status: 500 });
  }
}
