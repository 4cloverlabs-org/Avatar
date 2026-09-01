import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { socialAccount } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { accountId } = body;

    if (accountId) {
      // Disconnect specific account
      await db
        .delete(socialAccount)
        .where(
          and(
            eq(socialAccount.id, accountId),
            eq(socialAccount.userId, session.user.id),
            eq(socialAccount.platform, "facebook")
          )
        );
    } else {
      // Disconnect all facebook accounts for this user
      await db
        .delete(socialAccount)
        .where(
          and(
            eq(socialAccount.userId, session.user.id),
            eq(socialAccount.platform, "facebook")
          )
        );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to disconnect Facebook:", err);
    return NextResponse.json({ error: err.message || "Failed to disconnect" }, { status: 500 });
  }
}
