import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SCOPES = [
  "tweet.read",
  "tweet.write",
  "users.read",
  "offline.access"
].join(" ");

export async function GET(req: NextRequest) {
  const clientId = process.env.TWITTER_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "TWITTER_CLIENT_ID not configured" }, { status: 500 });
  }

  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const origin = `${protocol}://${host}`;
  const redirectUri = `${origin}/api/socials/twitter/callback`;

  // Generate PKCE code verifier and challenge
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  // State is used to prevent CSRF and keep track of the origin
  const state = origin;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: SCOPES,
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;

  const response = NextResponse.redirect(authUrl);

  // Store the code_verifier in an HttpOnly cookie so the callback can access it
  response.cookies.set("twitter_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: protocol === "https",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  return response;
}
