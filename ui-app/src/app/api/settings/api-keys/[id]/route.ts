import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiKey } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const keyId = id;
    await db.delete(apiKey).where(and(eq(apiKey.id, keyId), eq(apiKey.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
