const { Client, handle_file } = require('@gradio/client');
const fs = require('fs');

async function test() {
  try {
    const client = await Client.connect("http://127.0.0.1:7860");
    const videoPath = "/Users/sohith/Desktop/Avatar/results/avatars/573be9be-9111-43c4-96c8-f9924d4c9b2d/video.mp4";
    const buffer = fs.readFileSync(videoPath);
    const videoBlob = new Blob([buffer], { type: 'video/mp4' });
    
    console.log("Testing with handle_file wrapped in {video: ...}");
    // We try to pass it exactly how Gradio 4's VideoData expects
    const fileData = handle_file(videoBlob);
    
    // We can try `{ video: fileData }`
    const result = await client.predict("/prepare_avatar", [
      { video: fileData },
      0, 10, "jaw", 90, 90
    ]);
    console.log("Result:", result);
  } catch (e) {
    console.error("Predict failed:", e);
  }
}
test();
