import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const text = formData.get('text') as string;
    const audioFile = formData.get('audio') as File | null;

    if (!text) {
      return NextResponse.json({ success: false, error: "Text is required" }, { status: 400 });
    }

    if (!audioFile) {
      return NextResponse.json({ success: false, error: "A reference audio file is required for voice cloning." }, { status: 400 });
    }

    // Call Local Python TTS Server on port 8081
    const localFormData = new FormData();
    localFormData.append('text', text);
    localFormData.append('audio', audioFile);

    const ttsRes = await fetch('http://127.0.0.1:8081/clone_voice', {
      method: 'POST',
      body: localFormData
    });

    if (!ttsRes.ok) {
      const errText = await ttsRes.text();
      console.error("Local TTS Error:", errText);
      try {
        const errObj = JSON.parse(errText);
        return NextResponse.json({ success: false, error: errObj.error || "Failed to generate TTS locally" }, { status: ttsRes.status });
      } catch {
        return NextResponse.json({ success: false, error: "Failed to generate TTS locally" }, { status: 500 });
      }
    }

    const ttsBuffer = await ttsRes.arrayBuffer();

    return new NextResponse(ttsBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": 'attachment; filename="tts.wav"'
      }
    });

  } catch (error: any) {
    console.error("Local TTS API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
