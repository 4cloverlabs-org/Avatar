import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { workspace } from '../../../db/schema';
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

    let userWorkspaces = await db.query.workspace.findMany({
      where: eq(workspace.userId, session.user.id),
      orderBy: [desc(workspace.createdAt)]
    });

    // Auto-create default if empty
    if (userWorkspaces.length === 0) {
      const newWsId = crypto.randomUUID();
      await db.insert(workspace).values({
        id: newWsId,
        name: 'Personal Workspace',
        userId: session.user.id,
        plan: 'FREE'
      });
      userWorkspaces = await db.query.workspace.findMany({
        where: eq(workspace.userId, session.user.id),
        orderBy: [desc(workspace.createdAt)]
      });
    }

    return NextResponse.json({ success: true, workspaces: userWorkspaces });
  } catch (error: any) {
    console.error("GET /api/workspaces error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const newWsId = crypto.randomUUID();
    await db.insert(workspace).values({
      id: newWsId,
      name,
      userId: session.user.id,
      plan: 'FREE'
    });

    return NextResponse.json({ success: true, workspaceId: newWsId });
  } catch (error: any) {
    console.error("POST /api/workspaces error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
