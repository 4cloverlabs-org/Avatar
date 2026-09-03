import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { postToYouTube } from "@/lib/services/socials";

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

    const result = await postToYouTube(session.user.id, videoFilename, title, description, tags);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      videoId: result.videoId,
      youtubeUrl: result.youtubeUrl,
    });
  } catch (err: any) {
    console.error("YouTube upload route error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
