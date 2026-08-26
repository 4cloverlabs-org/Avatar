import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { notification } from '../../../../../db/schema';
import { auth } from '../../../../../lib/auth';
import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await db.update(notification)
      .set({ read: true })
      .where(and(eq(notification.id, id), eq(notification.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`PATCH /api/notifications/[id]/read error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
