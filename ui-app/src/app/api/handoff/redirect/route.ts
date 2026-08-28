import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { sessionHandoff, session } from '../../../../db/schema';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Consume handoff server-side
  const handoffRecords = await db.select()
    .from(sessionHandoff)
    .where(
      and(
        eq(sessionHandoff.token, token),
        gt(sessionHandoff.expiresAt, new Date())
      )
    );

  if (handoffRecords.length === 0) {
    return NextResponse.redirect(new URL('/login?error=invalid_handoff', req.url));
  }

  const handoff = handoffRecords[0];
  await db.delete(sessionHandoff).where(eq(sessionHandoff.id, handoff.id));

  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.insert(session).values({
    id: crypto.randomUUID(),
    token: sessionToken,
    userId: handoff.userId,
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const isProd = process.env.NODE_ENV === 'production';
  const cookieName = isProd ? '__Secure-better-auth.session_token' : 'better-auth.session_token';
  
  const res = NextResponse.redirect(new URL('/avatars/create/record', req.url));
  
  res.cookies.set(cookieName, sessionToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return res;
}
