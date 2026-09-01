import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { socialAccount } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state"); // origin URL
  const error = url.searchParams.get("error");

  if (error || !code) {
    const redirectBase = state || url.origin;
    return NextResponse.redirect(`${redirectBase}/socials?error=youtube_auth_failed`);
  }

  // Get current user session
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session?.user?.id) {
    const redirectBase = state || url.origin;
    return NextResponse.redirect(`${redirectBase}/login`);
  }

  const origin = state || url.origin;
  const redirectUri = `${origin}/api/socials/youtube/callback`;

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error("YouTube token exchange failed:", tokenData);
      return NextResponse.redirect(`${origin}/socials?error=youtube_token_failed`);
    }

    // Fetch channel info from YouTube Data API
    const channelRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );
    const channelData = await channelRes.json();

    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.redirect(`${origin}/socials?error=youtube_no_channel`);
    }

    const channel = channelData.items[0];
    const channelId = channel.id;
    const channelName = channel.snippet.title;
    const channelAvatar = channel.snippet.thumbnails?.default?.url || "";
    const subscriberCount = channel.statistics.subscriberCount || "0";
    const viewCount = channel.statistics.viewCount || "0";
    const videoCount = channel.statistics.videoCount || "0";

    const metadata = JSON.stringify({
      subscribers: subscriberCount,
      views: viewCount,
      videos: videoCount,
    });

    const existing = await db.select().from(socialAccount).where(
      and(
        eq(socialAccount.platform, "youtube"),
        eq(socialAccount.platformAccountId, channelId)
      )
    );

    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : null;

    if (existing.length > 0) {
      await db
        .update(socialAccount)
        .set({
          accountName: channelName,
          accountAvatar: channelAvatar,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || existing[0].refreshToken,
          tokenExpiresAt: expiresAt,
          metadata,
        })
        .where(eq(socialAccount.id, existing[0].id));
    } else {
      const id = `yt_${session.user.id}_${Date.now()}`;
      await db.insert(socialAccount).values({
        id,
        userId: session.user.id,
        platform: "youtube",
        platformAccountId: channelId,
        accountName: channelName,
        accountAvatar: channelAvatar,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        tokenExpiresAt: expiresAt,
        metadata,
      });
    }

    return NextResponse.redirect(`${origin}/socials?connected=youtube`);
  } catch (err) {
    console.error("YouTube callback error:", err);
    return NextResponse.redirect(`${origin}/socials?error=youtube_callback_error`);
  }
}
