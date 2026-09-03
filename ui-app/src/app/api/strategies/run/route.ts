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

    // Use voice/avatar from DB, or a known valid fallback for MVP
    const voiceId = strategyData.voiceId || "8507f90c-88fd-41e1-b817-372ba5d96ea4"; 
    const avatarId = strategyData.avatarId || "bf8b0499-0534-4dc3-b680-b8756f834ed5"; 

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
        uploadTimes: JSON.parse(strategyData.uploadTimes || '["12:00"]'),
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
