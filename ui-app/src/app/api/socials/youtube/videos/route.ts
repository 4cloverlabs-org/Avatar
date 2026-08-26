export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { socialAccount } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Helper: refresh access token if expired
async function refreshAccessToken(account: any): Promise<string> {
  if (!account.refreshToken) throw new Error("No refresh token");
  
  if (account.tokenExpiresAt && new Date(account.tokenExpiresAt) > new Date()) {
    return account.accessToken;
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      refresh_token: account.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("Token refresh failed");

  await db
    .update(socialAccount)
    .set({
      accessToken: data.access_token,
      tokenExpiresAt: new Date(Date.now() + (data.expires_in || 3600) * 1000),
    })
    .where(eq(socialAccount.id, account.id));

  return data.access_token;
}

export async function GET(req: NextRequest) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const accounts = await db
      .select()
      .from(socialAccount)
      .where(
        and(
          eq(socialAccount.userId, session.user.id),
          eq(socialAccount.platform, "youtube")
        )
      );

    if (accounts.length === 0) {
      return NextResponse.json({ error: "Not connected" }, { status: 404 });
    }

    const ytAccount = accounts[0];
    const accessToken = await refreshAccessToken(ytAccount);

    // 1. Fetch channel stats
    const channelRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const channelData = await channelRes.json();
    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }
    const channel = channelData.items[0];
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

    // 2. Fetch latest videos from the uploads playlist
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=10`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const videosData = await videosRes.json();

    const videoIds = (videosData.items || []).map((item: any) => item.contentDetails.videoId);

    // 3. Fetch stats for these videos
    let videos = [];
    if (videoIds.length > 0) {
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds.join(",")}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const statsData = await statsRes.json();
      const statsMap: any = {};
      (statsData.items || []).forEach((item: any) => {
        statsMap[item.id] = item;
      });

      videos = (videosData.items || []).map((item: any) => {
        const vid = item.contentDetails.videoId;
        const stats = statsMap[vid]?.statistics || {};
        const content = statsMap[vid]?.contentDetails || {};
        
        return {
          id: vid,
          title: item.snippet.title,
          views: stats.viewCount || "0",
          likes: stats.likeCount || "0",
          comments: stats.commentCount || "0",
          date: item.snippet.publishedAt.split('T')[0],
          duration: content.duration?.replace("PT", "").replace("S", "s").replace("M", "m") || "N/A",
          thumbnail: item.snippet.thumbnails?.medium?.url || "",
        };
      });
    }

    return NextResponse.json({
      success: true,
      channel: {
        name: channel.snippet.title,
        avatar: channel.snippet.thumbnails?.default?.url,
        subscribers: channel.statistics.subscriberCount,
        views: channel.statistics.viewCount,
        videos: channel.statistics.videoCount,
      },
      videos,
    });
  } catch (err) {
    console.error("Fetch YouTube videos error:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
