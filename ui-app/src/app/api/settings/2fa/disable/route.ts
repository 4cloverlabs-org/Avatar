import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { sql } from 'drizzle-orm';
import { auth } from '../../../../../lib/auth';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Soft disable: just flip the switch on the user table.
    // This preserves their secret in the two_factor table so they don't have to rescan the QR code if they re-enable it.
    await db.execute(sql`UPDATE "user" SET "two_factor_enabled" = false WHERE id = ${session.user.id}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to soft disable 2FA:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
