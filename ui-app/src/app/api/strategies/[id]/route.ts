import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { contentStrategy } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const body = await req.json();
    
    const updateData: any = {};
    if (body.niche !== undefined) updateData.niche = body.niche;
    if (body.durationValue !== undefined) updateData.durationValue = body.durationValue;
    if (body.durationUnit !== undefined) updateData.durationUnit = body.durationUnit;
    if (body.contentStyle !== undefined) updateData.contentStyle = body.contentStyle;
    if (body.frequency !== undefined) updateData.frequency = body.frequency;
    if (body.platforms !== undefined) updateData.platforms = JSON.stringify(body.platforms);
    if (body.uploadTimes !== undefined) updateData.uploadTimes = JSON.stringify(body.uploadTimes);

    const [updated] = await db
      .update(contentStrategy)
      .set(updateData)
      .where(and(eq(contentStrategy.id, id), eq(contentStrategy.userId, session.user.id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      strategy: {
        ...updated,
        platforms: JSON.parse(updated.platforms),
        uploadTimes: JSON.parse(updated.uploadTimes)
      } 
    });
  } catch (error: any) {
    console.error("PUT /api/strategies/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;

    const [deleted] = await db
      .delete(contentStrategy)
      .where(and(eq(contentStrategy.id, id), eq(contentStrategy.userId, session.user.id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: deleted.id });
  } catch (error: any) {
    console.error("DELETE /api/strategies/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
