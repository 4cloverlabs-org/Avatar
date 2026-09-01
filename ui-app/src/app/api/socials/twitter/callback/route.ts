import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { socialAccount } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const state = url.searchParams.get("state");
  const origin = state || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(`${origin}/socials?error=twitter_auth_failed`);
  }

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;
  const redirectUri = `${origin}/api/socials/twitter/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/socials?error=twitter_keys_missing`);
  }

  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    if (!session?.user?.id) {
      return NextResponse.redirect(`${origin}/login?redirect=/socials`);
    }

    const cookieStore = await cookies();
    const codeVerifier = cookieStore.get("twitter_code_verifier")?.value;

    if (!codeVerifier) {
      return NextResponse.redirect(`${origin}/socials?error=twitter_session_expired`);
    }

    // 1. Exchange code for access token
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: redirectUri,
      code: code,
      code_verifier: codeVerifier,
    });

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error) {
      console.error("Twitter token error:", tokenData);
      return NextResponse.redirect(`${origin}/socials?error=twitter_token_failed`);
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token; // if offline.access was requested

    // 2. Fetch User Profile
    const userRes = await fetch("https://api.twitter.com/2/users/me?user.fields=profile_image_url,public_metrics", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      }
    });
    const userData = await userRes.json();

    if (!userRes.ok || !userData.data) {
      console.error("Twitter user fetch error:", userData);
      return NextResponse.redirect(`${origin}/socials?error=twitter_profile_failed`);
    }

    const twitterUser = userData.data;
    const accountId = twitterUser.id;
    const accountName = `@${twitterUser.username}`;
    const accountAvatar = twitterUser.profile_image_url || "";
    const followers = twitterUser.public_metrics?.followers_count || 0;
    const posts = twitterUser.public_metrics?.tweet_count || 0;

    // 3. Save to database
    const existing = await db
      .select()
      .from(socialAccount)
      .where(
        and(
          eq(socialAccount.platform, "twitter"),
          eq(socialAccount.platformAccountId, accountId)
        )
      );

    const tokenExpiresAt = new Date(Date.now() + (tokenData.expires_in || 7200) * 1000); // Usually 2 hours

    if (existing.length > 0) {
      await db
        .update(socialAccount)
        .set({
          accountName,
          accountAvatar,
          accessToken,
          tokenExpiresAt,
          metadata: JSON.stringify({ followers, posts, refreshToken }),
        })
        .where(eq(socialAccount.id, existing[0].id));
    } else {
      await db.insert(socialAccount).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        platform: "twitter",
        platformAccountId: accountId,
        accountName,
        accountAvatar,
        accessToken,
        tokenExpiresAt,
        metadata: JSON.stringify({ followers, posts, refreshToken }),
      });
    }

    return NextResponse.redirect(`${origin}/socials?connected=twitter`);
  } catch (err) {
    console.error("Twitter OAuth callback error:", err);
    return NextResponse.redirect(`${origin}/socials?error=twitter_auth_exception`);
  }
}
