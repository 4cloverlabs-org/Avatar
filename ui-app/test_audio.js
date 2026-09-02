const { Client, handle_file } = require('@gradio/client');
const fs = require('fs');

async function test() {
  try {
    const client = await Client.connect("http://127.0.0.1:7860");
    const audioPath = "/Users/sohith/Desktop/Avatar/data/audio/yongen.wav"; // Use any valid path
    const buffer = fs.readFileSync(audioPath);
    const audioBlob = new Blob([buffer], { type: 'audio/wav' });
    
    // Test passing handle_file directly
    const result = await client.predict("/generate_from_avatar", [
      "dummy_id",
      handle_file(audioBlob),
      true, 0.5, "Original"
    ]);
    console.log("Result:", result);
  } catch (e) {
    console.error("Predict failed:", e.message);
  }
}
test();
