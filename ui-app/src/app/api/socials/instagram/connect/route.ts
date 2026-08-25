import { NextRequest, NextResponse } from "next/server";

const SCOPES = [
  "instagram_basic",
  "instagram_content_publish",
  "pages_show_list",
  "pages_read_engagement"
].join(",");

export async function GET(req: NextRequest) {
  const clientId = process.env.META_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "META_CLIENT_ID not configured" }, { status: 500 });
  }

  // Determine origin dynamically to support both localhost and ngrok
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const origin = `${protocol}://${host}`;

  const redirectUri = `${origin}/api/socials/instagram/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    state: origin, // pass origin so callback knows where to redirect back to
  });

  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
