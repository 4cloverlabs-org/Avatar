import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { sessionHandoff, session } from '../../../../db/schema';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    // Find the handoff token
    const handoffRecords = await db.select()
      .from(sessionHandoff)
      .where(
        and(
          eq(sessionHandoff.token, token),
          gt(sessionHandoff.expiresAt, new Date())
        )
      );

    if (handoffRecords.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 400 });
    }

    const handoff = handoffRecords[0];

    // Delete the token so it can't be used again
    await db.delete(sessionHandoff).where(eq(sessionHandoff.id, handoff.id));

    // Create a new session for the user
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(session).values({
      id: crypto.randomUUID(),
      token: sessionToken,
      userId: handoff.userId,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: req.headers.get('x-forwarded-for') || null,
      userAgent: req.headers.get('user-agent') || null,
    });

    // Set the cookie
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === 'production';
    const cookieName = isProd ? '__Secure-better-auth.session_token' : 'better-auth.session_token';
    
    cookieStore.set(cookieName, sessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/handoff/consume error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
