import { Client, handle_file } from '@gradio/client';
import fs from 'fs';

async function main() {
    console.log("Connecting to Gradio...");
    const client = await Client.connect("http://127.0.0.1:7860");
    console.log("Connected.");
    
    // Create a dummy video file or use an existing one
    // I will pass an existing video
    const videoPath = '../results/avatars/236a1dcd-f214-4cb3-8125-a6178a5682e7/video.mp4';
    if (!fs.existsSync(videoPath)) {
        console.error("Video not found!");
        return;
    }
    const buffer = fs.readFileSync(videoPath);
    const videoFile = new File([buffer], 'video.mp4', { type: 'video/mp4' });

    console.log("Submitting job...");
    const job = client.submit("/prepare_avatar", [ 
      { video: handle_file(videoFile) },
      0, // bboxShift
      10, // extraMargin
      'jaw', // parsingMode
      90, // leftCheekWidth
      90 // rightCheekWidth
    ]);

    for await (const message of job) {
        console.log("EVENT:", message.type, JSON.stringify(message, null, 2));
    }
}

main().catch(console.error);
