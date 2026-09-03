import { NextResponse } from 'next/server';
import { Client } from "@gradio/client";
import { db } from "@/lib/db";
import { video, contentStrategy } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { scriptSegments, voiceId, avatarId, strategyId, userId } = await request.json();

    const gradioUrl = process.env.NEXT_PUBLIC_GRADIO_URL || "http://127.0.0.1:7860";
    const client = await Client.connect(gradioUrl);

    // Call the Gradio API we just added
    const result = await client.predict("/generate_strategy_video", [
      JSON.stringify(scriptSegments), // strategy_script
      voiceId,                        // strategy_voice
      avatarId,                       // strategy_avatar
      strategyId,                     // strategy_id_input
      userId                          // strategy_user_input
    ]);

    const resultData = JSON.parse(result.data[0]);

    if (!resultData.success) {
      throw new Error(resultData.error);
    }

    // Since the video was generated successfully, let's create a record in the video table
    // Fetch the strategy to get the title (or use a default)
    const strategyObj = await db.query.contentStrategy.findFirst({
      where: eq(contentStrategy.id, strategyId)
    });
    
    const title = `Auto-Generated: ${strategyObj?.niche || "Content Strategy"}`;
    const filename = resultData.video_path.split("/").pop() || `auto_${Date.now()}.mp4`;

    await db.insert(video).values({
      id: `gen_strat_${Date.now()}`,
      userId,
      strategyId,
      title,
      platform: "YouTube", // Default for now
      status: "Scheduled",
      views: "0",
      likes: "0",
      shares: "0"
    });

    return NextResponse.json({ success: true, ...resultData });
  } catch (error: any) {
    console.error("Generate strategy video API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
