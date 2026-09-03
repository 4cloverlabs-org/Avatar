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

export const fetchTrendingTopics = inngest.createFunction(
  {
    id: "fetch-trending-topics",
    // Run every 6 hours
    triggers: [{ cron: "0 */6 * * *" }],
  },
  async ({ step }) => {
    // Query db for active niches picked by users
    const activeNiches = await step.run("get-active-niches", async () => {
      const { db } = await import("../lib/db");
      const { contentStrategy } = await import("../db/schema");
      const strategies = await db.select().from(contentStrategy);
      const uniqueNiches = [...new Set(strategies.map(s => s.niche))];
      return uniqueNiches.length > 0 ? uniqueNiches : ['Technology & Gadgets'];
    });
    
    for (const niche of activeNiches) {
      await step.run(`scrape-niche-${niche.toLowerCase().replace(/[^a-z0-9]/g, '')}`, async () => {
        // dynamic import to avoid bundling issues
        const { runScraperForNiche } = await import("../lib/services/scraper");
        await runScraperForNiche(niche);
      });
    }

    return { success: true, nichesScraped: activeNiches.length, niches: activeNiches };
  }
);

export const generateContentStrategy = inngest.createFunction(
  {
    id: "generate-content-strategy",
    triggers: [{ event: "strategy/generate.requested" }]
  },
  async ({ event, step }) => {
    const { strategyId, userId, niche, style, durationValue, durationUnit, platforms, uploadTimes, voiceId, avatarId } = event.data as any;

    // Step 1: Select Topic (Repetition Guard)
    const topic = await step.run("select-topic", async () => {
      const { selectNextTopicForStrategy } = await import("../lib/services/scraper");
      const selected = await selectNextTopicForStrategy(strategyId, userId, niche);
      if (!selected) throw new Error(`No available topics for niche: ${niche}`);
      return selected;
    });

    // Step 2: Research & Verification
    const researchBrief = await step.run("research-topic", async () => {
      const { generateResearchBrief } = await import("../lib/services/research");
      return await generateResearchBrief(topic.title, topic.url);
    });

    // Step 3-4: Generate & QA Loop (Max 3 retries)
    let script: any = null;
    let qaPassed = false;
    let qaFeedback: string | undefined = undefined;

    for (let i = 0; i < 3; i++) {
      script = await step.run(`generate-script-attempt-${i+1}`, async () => {
        const { generateScript } = await import("../lib/services/generation");
        return await generateScript(researchBrief, style, durationValue, durationUnit, platforms, qaFeedback);
      });

      const qaResult = await step.run(`qa-script-attempt-${i+1}`, async () => {
        const { runScriptQA } = await import("../lib/services/qa");
        return await runScriptQA(researchBrief, script);
      });

      if (qaResult.passed) {
        qaPassed = true;
        break;
      }
      qaFeedback = qaResult.feedback || "Unknown QA failure";
    }

    // Save state to DB
    await step.run("save-generated-script", async () => {
      const { db } = await import("../lib/db");
      const { generatedScript } = await import("../db/schema");
      
      await db.insert(generatedScript).values({
        id: `gen_${Date.now()}`,
        strategyId,
        userId,
        topicId: topic.id,
        researchBrief: JSON.stringify(researchBrief),
        scriptContent: JSON.stringify(script),
        qaStatus: qaPassed ? "passed" : "failed",
        qaFeedback: qaPassed ? null : qaFeedback,
        retryCount: 3
      });
    });

    if (!qaPassed) {
      throw new Error(`QA Failed after 3 retries. Manual review required.`);
    }

    // Step 5: Render Video
    const videoResult = await step.run("render-strategy-video", async () => {
      const { Client } = await import("@gradio/client");
      const client = await Client.connect(process.env.NEXT_PUBLIC_GRADIO_URL || "http://127.0.0.1:7860");
      
      // FIRE AND FORGET. Do not await predict() because video takes 15 mins!
      // The python backend will ping /api/videos/webhook when done.
      client.submit("/generate_strategy_video", [
        JSON.stringify(script.body),
        voiceId,
        avatarId,
        strategyId,
        userId
      ]);
      
      return { status: "generating_in_background" };
    });

    // Step 6: Wait for Python video generation to complete via Webhook
    const videoGenerationEvent = await step.waitForEvent("wait-for-video", {
      event: "video/generation.completed",
      timeout: "24h",
      match: "data.strategyId"
    });

    if (!videoGenerationEvent) {
      throw new Error("Video generation timed out");
    }

    const { video_path } = videoGenerationEvent.data;

    // Step 7: Sleep until target upload time
    if (uploadTimes && uploadTimes.length > 0) {
      // Pick the first upload time for this run
      const timeString = uploadTimes[0]; // e.g. "15:00"
      const [hours, minutes] = timeString.split(":").map(Number);
      
      const now = new Date();
      const targetDate = new Date();
      targetDate.setHours(hours, minutes, 0, 0);

      // If the time has already passed today, schedule for tomorrow
      if (targetDate.getTime() <= now.getTime()) {
        targetDate.setDate(targetDate.getDate() + 1);
      }

      await step.sleepUntil("wait-for-upload", targetDate);
    }

    // Step 8: Upload to active platforms
    const uploadResults = await step.run("upload-to-socials", async () => {
      const results: Record<string, any> = {};
      const { postToYouTube, postToTikTok, postToInstagram } = await import("../lib/services/socials");

      if (platforms && Array.isArray(platforms)) {
        for (const platform of platforms) {
          const platformLower = platform.toLowerCase();
          
          if (platformLower === "youtube" || platformLower === "youtube shorts") {
            const res = await postToYouTube(
              userId, 
              video_path, 
              topic.title, 
              script.body.join(" "), 
              niche
            );
            results.youtube = res;
          } else if (platformLower === "tiktok") {
            const res = await postToTikTok(userId, video_path, topic.title);
            results.tiktok = res;
          } else if (platformLower === "instagram" || platformLower === "instagram reels") {
            const res = await postToInstagram(userId, video_path, topic.title);
            results.instagram = res;
          }
        }
      }
      
      // Update DB to mark as Posted
      const { db } = await import("../lib/db");
      const { video } = await import("../db/schema");
      const { eq, desc } = await import("drizzle-orm");
      
      // Find the most recent video for this strategy
      const latestVideo = await db.query.video.findFirst({
        where: eq(video.strategyId, strategyId),
        orderBy: [desc(video.id)]
      });
      
      if (latestVideo) {
        await db.update(video)
          .set({ status: "Posted" })
          .where(eq(video.id, latestVideo.id));
      }
      
      return results;
    });

    return { success: true, topic: topic.title, uploadResults };
  }
);
