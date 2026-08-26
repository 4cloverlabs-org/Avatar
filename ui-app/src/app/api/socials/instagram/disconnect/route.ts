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
    // We could make an API call to Facebook to revoke permissions,
    // but typically just deleting the token from our DB is sufficient
    // for disconnect (user can revoke from FB settings if they want).
    
    await db
      .delete(socialAccount)
      .where(
        and(
          eq(socialAccount.userId, session.user.id),
          eq(socialAccount.platform, "instagram")
        )
      );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Instagram disconnect error:", err);
    return NextResponse.json({ error: "Failed to disconnect Instagram" }, { status: 500 });
  }
}
