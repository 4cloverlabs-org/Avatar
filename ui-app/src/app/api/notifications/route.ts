import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { notification } from '../../../db/schema';
import { auth } from '../../../lib/auth';
import { headers } from 'next/headers';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await db.select()
      .from(notification)
      .where(eq(notification.userId, session.user.id))
      .orderBy(desc(notification.createdAt));

    return NextResponse.json({ success: true, notifications });
  } catch (error: any) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Helper to create notifications internally, can be used for testing
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.message || !body.type) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newNotification = await db.insert(notification).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      title: body.title,
      message: body.message,
      type: body.type, // 'video', 'system', 'account', 'avatar'
    }).returning();

    return NextResponse.json({ success: true, notification: newNotification[0] });
  } catch (error: any) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
