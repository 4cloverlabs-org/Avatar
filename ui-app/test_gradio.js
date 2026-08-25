const { Client, handle_file } = require('@gradio/client');

async function test() {
  const client = await Client.connect("http://127.0.0.1:7860");
  const result = await client.predict("/prepare_avatar", [ 
    { video: handle_file("F:/MuseTalk/ui-app/test.mp4") },
    0,
    10,
    "jaw",
    90,
    90
  ]);
  console.log(result);
}
test();
