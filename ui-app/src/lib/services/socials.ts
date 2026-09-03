import { db } from "@/lib/db";
import { socialAccount } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import fs from "fs";
import path from "path";

// Helper: refresh access token if expired
export async function refreshAccessToken(account: any): Promise<string> {
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
  if (!data.access_token) {
    console.error("Google Token Refresh Failed:", JSON.stringify(data, null, 2));
    throw new Error(`Token refresh failed: ${data.error_description || data.error || 'Unknown error'}`);
  }

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

export async function postToYouTube(
  userId: string,
  videoFilename: string,
  title: string,
  description: string,
  tags?: string
): Promise<{ success: boolean; videoId?: string; youtubeUrl?: string; error?: string }> {
  try {
    // Get YouTube account
    const accounts = await db
      .select()
      .from(socialAccount)
      .where(
        and(
          eq(socialAccount.userId, userId),
          eq(socialAccount.platform, "youtube")
        )
      );

    if (accounts.length === 0) {
      return { success: false, error: "YouTube account not connected" };
    }

    const ytAccount = accounts[0];
    const accessToken = await refreshAccessToken(ytAccount);

    // Read the video file (check if it's an absolute path, a python backend relative path, or relative to public/videos)
    let videoPath = videoFilename;
    if (videoFilename.startsWith("./results/")) {
      videoPath = path.resolve(process.cwd(), "..", videoFilename);
    } else if (!videoFilename.startsWith("/") && !videoFilename.includes(":\\")) {
      videoPath = path.join(process.cwd(), "public", "videos", videoFilename);
    }

    if (!fs.existsSync(videoPath)) {
      return { success: false, error: `Video file not found at ${videoPath}` };
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
      return { success: false, error: "YouTube upload initiation failed", };
    }

    const uploadUrl = initRes.headers.get("location");
    if (!uploadUrl) {
      return { success: false, error: "No upload URL returned from YouTube" };
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
      return { success: false, error: "YouTube video upload failed" };
    }

    const uploadResult = await uploadRes.json();

    return {
      success: true,
      videoId: uploadResult.id,
      youtubeUrl: `https://www.youtube.com/shorts/${uploadResult.id}`,
    };
  } catch (err: any) {
    console.error("YouTube upload error:", err);
    return { success: false, error: err.message || "Upload failed" };
  }
}

// Mock functions for TikTok and Instagram
export async function postToTikTok(
  userId: string,
  videoPath: string,
  title: string
): Promise<{ success: boolean; videoId?: string; tiktokUrl?: string; error?: string }> {
  console.log(`[MOCK] Posting to TikTok for user ${userId}: ${title}`);
  console.log(`[MOCK] Video Path: ${videoPath}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    videoId: `mock_tt_${Date.now()}`,
    tiktokUrl: `https://www.tiktok.com/@user/video/mock_tt_${Date.now()}`
  };
}

export async function postToInstagram(
  userId: string,
  videoPath: string,
  title: string
): Promise<{ success: boolean; videoId?: string; instagramUrl?: string; error?: string }> {
  console.log(`[MOCK] Posting to Instagram for user ${userId}: ${title}`);
  console.log(`[MOCK] Video Path: ${videoPath}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    videoId: `mock_ig_${Date.now()}`,
    instagramUrl: `https://www.instagram.com/p/mock_ig_${Date.now()}`
  };
}
