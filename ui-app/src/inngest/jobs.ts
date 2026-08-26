import { inngest } from "../lib/inngest-client";

export const renderAvatarVideo = inngest.createFunction(
  { 
    id: "render-avatar-video", 
    triggers: [{ event: "avatar/render.requested" }] 
  },
  async ({ event, step }) => {
    const { videoId, avatarId, prompt, aspect } = event.data as {
      videoId: string;
      avatarId: string;
      prompt: string;
      aspect: string;
    };

    // Step 1: Generate Script via LLM API call
    const script = await step.run("generate-script", async () => {
      return `Generated script content based on prompt: "${prompt}"`;
    });

    // Step 2: Trigger Python FastAPI GPU Inference
    const renderResult = await step.run("call-fastapi-gpu", async () => {
      const fastapiUrl = process.env.FASTAPI_INFERENCE_URL || "http://localhost:8000";
      
      const response = await fetch(`${fastapiUrl}/api/prepare_avatar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FASTAPI_API_KEY || ""}`
        },
        body: JSON.stringify({
          videoId,
          avatarId,
          script,
          aspect
        }),
      });

      if (!response.ok) {
        throw new Error(`GPU Inference endpoint returned error: ${response.statusText}`);
      }

      return response.json();
    });

    // Step 3: Complete execution & log results
    await step.run("complete-job-pipeline", async () => {
      console.log(`Pipeline successfully executed for video: ${videoId}. Result:`, renderResult);
    });

    return {
      success: true,
      videoId,
      renderResult
    };
  }
);
