import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    // The database uses `onDelete: "cascade"` for related records like sessions, accounts, workspaces, etc.
    // So deleting the user record will clean up most relational data.
    await db.delete(user).where(eq(user.id, userId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
