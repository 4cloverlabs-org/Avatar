import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { contentStrategy } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const strategies = await db
      .select()
      .from(contentStrategy)
      .where(eq(contentStrategy.userId, session.user.id));
      
    const parsed = strategies.map(s => ({
      ...s,
      platforms: JSON.parse(s.platforms),
      uploadTimes: JSON.parse(s.uploadTimes)
    }));

    return NextResponse.json({ success: true, strategies: parsed });
  } catch (error: any) {
    console.error("GET /api/strategies error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, niche, durationValue, durationUnit, contentStyle, frequency, platforms, uploadTimes, voiceId, avatarId } = body;

    const [newStrategy] = await db.insert(contentStrategy).values({
      id: id || `strat-${Date.now()}`,
      userId: session.user.id,
      niche: niche || 'Gaming',
      durationValue: durationValue || '10',
      durationUnit: durationUnit || 'Days',
      contentStyle: contentStyle || 'Entertaining',
      frequency: frequency || '1 video per day',
      platforms: JSON.stringify(platforms || []),
      uploadTimes: JSON.stringify(uploadTimes || ['12:00']),
      voiceId: voiceId || null,
      avatarId: avatarId || null
    }).returning();

    return NextResponse.json({ 
      success: true, 
      strategy: {
        ...newStrategy,
        platforms: JSON.parse(newStrategy.platforms),
        uploadTimes: JSON.parse(newStrategy.uploadTimes)
      } 
    });
  } catch (error: any) {
    console.error("POST /api/strategies error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
