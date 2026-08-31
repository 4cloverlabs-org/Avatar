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
    
    // Save File object to a temp file because @gradio/client in Node doesn't handle Web File objects well
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const os = require('os');
    const path = require('path');
    const fs = require('fs');
    
    const tempAudioPath = path.join(os.tmpdir(), `temp_audio_${Date.now()}.wav`);
    fs.writeFileSync(tempAudioPath, buffer);

    console.log(`Saved audio to ${tempAudioPath}, running generate_from_avatar task...`);
    
    try {
      // Create a timeout promise (e.g. 60 minutes)
      const timeoutMs = 60 * 60 * 1000;
      let isTimeout = false;
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => {
          isTimeout = true;
          reject(new Error('Gradio prediction timed out'));
        }, timeoutMs)
      );

      // Race the prediction against the timeout
      let result: any;
      try {
        result = await Promise.race([
          client.predict("/generate_from_avatar", [ 
            avatarId,
            handle_file(tempAudioPath),
            true, 
            1.0   
          ]),
          timeoutPromise
        ]);
        
        console.log("Generation complete!", result.data);
        
        const generatedData = result.data[0];
        const generatedPath = typeof generatedData === 'string' ? generatedData : (generatedData.path || generatedData.url || generatedData.video?.path);
        const aspectRatio = formData.get('aspectRatio') as string;
        
        if (aspectRatio && generatedPath) {
          const [w, h] = aspectRatio.split('/');
          if (w && h) {
             console.log(`Cropping video to ${aspectRatio}...`);
             const outputPath = generatedPath.replace('.mp4', `_${w}x${h}.mp4`);
             const { execSync } = require('child_process');
             try {
                execSync(`ffmpeg -y -i "${generatedPath}" -vf "crop=trunc(min(iw\\,ih*${w}/${h})/2)*2:trunc(min(ih\\,iw*${h}/${w})/2)*2" -c:v libx264 -c:a copy "${outputPath}"`, { stdio: 'ignore' });
                if (typeof result.data[0] === 'string') {
                   result.data[0] = outputPath;
                } else {
                   result.data[0].path = outputPath;
                }
                console.log(`Successfully cropped video to ${outputPath}`);
             } catch(e) {
                console.error("FFmpeg crop failed, keeping original:", e);
             }
          }
        }
      } catch (err: any) {
        if (isTimeout || (err.message && (err.message.includes('time') || err.message.includes('timeout')))) {
          console.log("Gradio client timed out or dropped connection. Manually checking output directory...");
          // Fallback: check if the video was actually generated on disk
          const avatarOutputDir = path.join(process.cwd(), '..', 'results', 'avatars', avatarId, 'output');
          if (fs.existsSync(avatarOutputDir)) {
            const files = fs.readdirSync(avatarOutputDir);
            const generatedMp4 = files.find((f: string) => f.endsWith('.mp4') && f.startsWith('final_'));
            if (generatedMp4) {
              const fullPath = path.join(avatarOutputDir, generatedMp4);
              console.log("Found generated video on disk despite timeout:", fullPath);
              result = { data: [fullPath] };
            } else {
              throw new Error("Generation is taking longer than 60 minutes. It is still running in the background, but the UI connection closed. Please check the Videos section later.");
            }
          } else {
            throw new Error("Generation is taking longer than 60 minutes. It is still running in the background, but the UI connection closed. Please check the Videos section later.");
          }
        } else {
          fs.writeFileSync('api_error.log', `Error in predict:\n${err.message}\n${err.stack}\nAvatar: ${avatarId}\n`);
          throw err;
        }
      }
      
      // Cleanup temp file
      try { fs.unlinkSync(tempAudioPath); } catch (e) {}

      return NextResponse.json({ 
        success: true, 
        data: result.data 
      });
    } catch (apiErr: any) {
      // Cleanup temp file on error
      try { fs.unlinkSync(tempAudioPath); } catch (e) {}
      throw apiErr;
    }
  } catch (error: any) {
    console.error("API Route Error:", error);
    const fs = require('fs');
    fs.appendFileSync('api_error.log', `\nAPI Route Error:\n${error.message}\n${error.stack}\n`);
    return NextResponse.json({ success: false, error: error.message || "Failed to generate video" }, { status: 500 });
  }
}
