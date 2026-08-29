import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userPreferences } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    let prefs = await db.query.userPreferences.findFirst({
      where: eq(userPreferences.userId, userId)
    });

    if (!prefs) {
      const inserted = await db.insert(userPreferences).values({
        id: crypto.randomUUID(),
        userId: userId,
      }).returning();
      prefs = inserted[0];
    }

    return NextResponse.json({ success: true, preferences: prefs });
  } catch (error: any) {
    console.error("GET Preferences Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    const { dashboardTheme, logExplorerTheme, highContrastMode } = body;

    const existing = await db.query.userPreferences.findFirst({
      where: eq(userPreferences.userId, userId)
    });

    let prefs;
    if (existing) {
      const updated = await db.update(userPreferences)
        .set({
          dashboardTheme: dashboardTheme ?? existing.dashboardTheme,
          logExplorerTheme: logExplorerTheme ?? existing.logExplorerTheme,
          highContrastMode: highContrastMode ?? existing.highContrastMode,
        })
        .where(eq(userPreferences.userId, userId))
        .returning();
      prefs = updated[0];
    } else {
      const inserted = await db.insert(userPreferences).values({
        id: crypto.randomUUID(),
        userId: userId,
        dashboardTheme: dashboardTheme ?? "light",
        logExplorerTheme: logExplorerTheme ?? "match",
        highContrastMode: highContrastMode ?? false,
      }).returning();
      prefs = inserted[0];
    }

    return NextResponse.json({ success: true, preferences: prefs });
  } catch (error: any) {
    console.error("POST Preferences Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
