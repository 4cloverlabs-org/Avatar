export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { socialAccount } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const accounts = await db
      .select({
        id: socialAccount.id,
        platform: socialAccount.platform,
        platformAccountId: socialAccount.platformAccountId,
        accountName: socialAccount.accountName,
        accountAvatar: socialAccount.accountAvatar,
        metadata: socialAccount.metadata,
        connectedAt: socialAccount.connectedAt,
      })
      .from(socialAccount)
      .where(eq(socialAccount.userId, session.user.id));

    // Parse metadata JSON for each account
    const parsed = accounts.map((a) => ({
      ...a,
      metadata: a.metadata ? JSON.parse(a.metadata) : {},
    }));

    return NextResponse.json({ success: true, accounts: parsed });
  } catch (err) {
    console.error("Fetch social accounts error:", err);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}
