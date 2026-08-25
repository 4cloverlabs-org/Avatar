import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { socialAccount } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

// Helper: refresh access token if expired
async function refreshAccessToken(account: any): Promise<string> {
  if (!account.refreshToken) throw new Error("No refresh token");
  
  // Check if token is still valid
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

  // Update token in DB
  await db
    .update(socialAccount)
    .set({
      accessToken: data.access_token,
      tokenExpiresAt: new Date(Date.now() + (data.expires_in || 3600) * 1000),
    })
    .where(eq(socialAccount.id, account.id));

  return data.access_token;
}

export async function POST(req: NextRequest) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { videoFilename, title, description, tags } = body;

    if (!videoFilename || !title) {
      return NextResponse.json(
        { error: "videoFilename and title are required" },
        { status: 400 }
      );
    }

    // Get YouTube account
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
      return NextResponse.json(
        { error: "YouTube account not connected" },
        { status: 400 }
      );
    }

    const ytAccount = accounts[0];
    const accessToken = await refreshAccessToken(ytAccount);

    // Read the video file
    const videoDir = path.join(process.cwd(), "public", "videos");
    const videoPath = path.join(videoDir, videoFilename);

    if (!fs.existsSync(videoPath)) {
      return NextResponse.json({ error: "Video file not found" }, { status: 404 });
    }

    const videoBuffer = fs.readFileSync(videoPath);
    const videoSize = videoBuffer.length;

    // YouTube resumable upload: Step 1 — initiate
    const metadata = {
      snippet: {
        title,
        description: description || "",
        tags: tags ? tags.split(",").map((t: string) => t.trim()) : [],
        categoryId: "22", // People & Blogs
      },
      status: {
        privacyStatus: "public",
        selfDeclaredMadeForKids: false,
      },
    };

    const initRes = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Length": String(videoSize),
          "X-Upload-Content-Type": "video/mp4",
        },
        body: JSON.stringify(metadata),
      }
    );

    if (!initRes.ok) {
      const errText = await initRes.text();
      console.error("YouTube upload init failed:", errText);
      return NextResponse.json(
        { error: "YouTube upload initiation failed", details: errText },
        { status: 500 }
      );
    }

    const uploadUrl = initRes.headers.get("location");
    if (!uploadUrl) {
      return NextResponse.json(
        { error: "No upload URL returned from YouTube" },
        { status: 500 }
      );
    }

    // YouTube resumable upload: Step 2 — upload the video
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(videoSize),
      },
      body: videoBuffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("YouTube upload failed:", errText);
      return NextResponse.json(
        { error: "YouTube video upload failed", details: errText },
        { status: 500 }
      );
    }

    const uploadResult = await uploadRes.json();

    return NextResponse.json({
      success: true,
      videoId: uploadResult.id,
      youtubeUrl: `https://www.youtube.com/shorts/${uploadResult.id}`,
    });
  } catch (err: any) {
    console.error("YouTube upload error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
