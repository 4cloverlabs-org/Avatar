import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiKey } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const keys = await db.query.apiKey.findMany({
      where: eq(apiKey.userId, session.user.id),
      orderBy: (keys, { desc }) => [desc(keys.createdAt)]
    });

    // Don't return hashes to the client
    const safeKeys = keys.map(k => ({
      id: k.id,
      name: k.name,
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt
    }));

    return NextResponse.json({ success: true, apiKeys: safeKeys });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const name = body.name || "Default Key";

    // Generate a secure API key
    const rawKey = `sk_test_${crypto.randomBytes(24).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const inserted = await db.insert(apiKey).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      name,
      keyHash
    }).returning();

    return NextResponse.json({ success: true, apiKey: { ...inserted[0], rawKey } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
