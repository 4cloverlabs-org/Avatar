import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { sessionHandoff } from '../../../../db/schema';
import { auth } from '../../../../lib/auth';
import { headers } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await db.insert(sessionHandoff).values({
      id: crypto.randomUUID(),
      token,
      userId: session.user.id,
      expiresAt,
    });

    return NextResponse.json({ success: true, token });
  } catch (error: any) {
    console.error("POST /api/handoff/create error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
