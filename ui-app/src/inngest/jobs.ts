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
    // In a real app, query db for active niches. For MVP, we use hardcoded array.
    const niches = ['Technology & Gadgets', 'Gaming', 'Finance & Crypto', 'Health & Fitness'];
    
    for (const niche of niches) {
      await step.run(`scrape-niche-${niche.toLowerCase().replace(/[^a-z0-9]/g, '')}`, async () => {
        // dynamic import to avoid bundling issues
        const { runScraperForNiche } = await import("../lib/services/scraper");
        await runScraperForNiche(niche);
      });
    }

    return { success: true, nichesScraped: niches.length };
  }
);

export const generateContentStrategy = inngest.createFunction(
  {
    id: "generate-content-strategy",
    triggers: [{ event: "strategy/generate.requested" }]
  },
  async ({ event, step }) => {
    const { strategyId, userId, niche, style, durationValue, durationUnit, platforms, voiceId, avatarId } = event.data as any;

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
      const apiUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      
      const res = await fetch(`${apiUrl}/api/generate_strategy_video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scriptSegments: script.body,
          voiceId,
          avatarId,
          strategyId,
          userId
        })
      });

      if (!res.ok) throw new Error("Failed to trigger video generation");
      return await res.json();
    });

    return { success: true, topic: topic.title, videoResult };
  }
);
