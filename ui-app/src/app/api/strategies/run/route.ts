import { NextResponse } from 'next/server';
import { inngest } from '@/lib/inngest-client';
import { db } from "@/lib/db";
import { contentStrategy } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { strategyId } = await request.json();

    if (!strategyId) {
      return NextResponse.json({ success: false, error: 'strategyId is required' }, { status: 400 });
    }

    const strategyData = await db.query.contentStrategy.findFirst({
      where: eq(contentStrategy.id, strategyId)
    });

    if (!strategyData) {
      return NextResponse.json({ success: false, error: 'Strategy not found' }, { status: 404 });
    }

    // Default voice/avatar for MVP if not set, would usually fetch from the UI
    const voiceId = "system_drew"; // Default system voice
    const avatarId = "default_avatar"; 

    // Send the event to Inngest
    await inngest.send({
      name: "strategy/generate.requested",
      data: {
        strategyId: strategyData.id,
        userId: strategyData.userId,
        niche: strategyData.niche,
        style: strategyData.contentStyle,
        durationValue: strategyData.durationValue,
        durationUnit: strategyData.durationUnit,
        platforms: JSON.parse(strategyData.platforms || '["youtube"]'),
        voiceId,
        avatarId
      }
    });

    return NextResponse.json({ success: true, message: "Strategy generation pipeline triggered" });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
