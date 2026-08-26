import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { socialAccount } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the YouTube account to revoke the token
    const accounts = await db
      .select()
      .from(socialAccount)
      .where(
        and(
          eq(socialAccount.userId, session.user.id),
          eq(socialAccount.platform, "youtube")
        )
      );

    if (accounts.length > 0) {
      const ytAccount = accounts[0];
      // Attempt to revoke the token with Google
      try {
        await fetch(
          `https://oauth2.googleapis.com/revoke?token=${ytAccount.accessToken}`,
          { method: "POST" }
        );
      } catch {
        // Token revocation is best-effort
      }

      // Delete from database
      await db
        .delete(socialAccount)
        .where(eq(socialAccount.id, ytAccount.id));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("YouTube disconnect error:", err);
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}
