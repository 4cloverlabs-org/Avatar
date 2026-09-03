import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { video, contentStrategy } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { strategyId, userId, video_path } = await request.json();
    
    const strategyObj = await db.query.contentStrategy.findFirst({
      where: eq(contentStrategy.id, strategyId)
    });
    
    const title = `Auto-Generated: ${strategyObj?.niche || "Content Strategy"}`;
    
    await db.insert(video).values({
      id: `gen_strat_${Date.now()}`,
      userId,
      strategyId,
      title,
      platform: "YouTube", // Will be updated by Inngest job
      status: "Generated",
      views: "0",
      likes: "0",
      shares: "0"
    });
    
    // Fire Inngest event
    const { inngest } = await import("@/lib/inngest-client");
    await inngest.send({
      name: "video/generation.completed",
      data: { strategyId, userId, video_path }
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
