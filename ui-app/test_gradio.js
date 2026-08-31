const { Client, handle_file } = require('@gradio/client');
const fs = require('fs');

async function main() {
    try {
        console.log("Connecting to Gradio...");
        const client = await Client.connect("http://127.0.0.1:7860");
        
        // Find a valid avatar ID
        const avatarsDir = '../results/avatars';
        const dirs = fs.readdirSync(avatarsDir).filter(f => fs.statSync(`${avatarsDir}/${f}`).isDirectory());
        const avatarId = dirs.find(d => fs.existsSync(`${avatarsDir}/${d}/meta.json`));
        
        if (!avatarId) {
            console.log("No valid avatar found");
            return;
        }
        
        console.log(`Using avatar ${avatarId}`);
        
        // Create a dummy audio file
        fs.writeFileSync('dummy.wav', 'dummy');
        
        console.log("Predicting...");
        const result = await client.predict("/generate_from_avatar", [ 
            avatarId,
            handle_file('dummy.wav'),
            true, 
            1.0   
        ]);
        
        console.log("Success:", result);
    } catch (e) {
        console.error("Error occurred:", e);
        console.log("Error details:", JSON.stringify(e, null, 2));
    }
}

main();
