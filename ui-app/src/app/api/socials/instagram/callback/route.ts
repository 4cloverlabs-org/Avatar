import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { socialAccount } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const origin = url.searchParams.get("state") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(`${origin}/socials?error=instagram_auth_failed`);
  }

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const clientId = process.env.META_CLIENT_ID;
  const clientSecret = process.env.META_CLIENT_SECRET;
  const redirectUri = `${origin}/api/socials/instagram/callback`;

  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    if (!session?.user?.id) {
      return NextResponse.redirect(`${origin}/login?redirect=/socials`);
    }

    // 1. Exchange code for short-lived access token
    const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`);
    const tokenData = await tokenRes.json();
    
    if (tokenData.error) {
      console.error("Meta token error:", tokenData.error);
      return NextResponse.redirect(`${origin}/socials?error=instagram_token_failed`);
    }

    const shortLivedToken = tokenData.access_token;

    // 2. Exchange short-lived token for long-lived token
    const longTokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${shortLivedToken}`);
    const longTokenData = await longTokenRes.json();
    
    const accessToken = longTokenData.access_token || shortLivedToken;

    // 3. Fetch user's Facebook Pages
    const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
    const pagesData = await pagesRes.json();
    
    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(`${origin}/socials?error=no_facebook_pages`);
    }

    // 4. Find the first page with a connected Instagram Business Account
    let igAccountId = null;
    let pageToken = null;

    for (const page of pagesData.data) {
      const pageInfoRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`);
      const pageInfoData = await pageInfoRes.json();
      
      if (pageInfoData.instagram_business_account?.id) {
        igAccountId = pageInfoData.instagram_business_account.id;
        pageToken = page.access_token; // Store page token if needed later
        break;
      }
    }

    if (!igAccountId) {
      return NextResponse.redirect(`${origin}/socials?error=no_instagram_account_linked`);
    }

    // 5. Fetch Instagram Account Details
    const igRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}?fields=username,profile_picture_url,followers_count,media_count&access_token=${accessToken}`);
    const igData = await igRes.json();

    const accountName = igData.username || "Instagram Account";
    const accountAvatar = igData.profile_picture_url || "";
    const followers = igData.followers_count || 0;
    const posts = igData.media_count || 0;

    // 6. Save to database
    // Check if user already has an IG account connected
    const existing = await db
      .select()
      .from(socialAccount)
      .where(
        and(
          eq(socialAccount.userId, session.user.id),
          eq(socialAccount.platform, "instagram")
        )
      );

    const tokenExpiresAt = new Date(Date.now() + (longTokenData.expires_in || 5184000) * 1000); // Defaults to 60 days if expires_in missing

    if (existing.length > 0) {
      await db
        .update(socialAccount)
        .set({
          platformAccountId: igAccountId,
          accountName,
          accountAvatar,
          accessToken,
          tokenExpiresAt,
          metadata: JSON.stringify({ followers, posts, pageToken }),
        })
        .where(eq(socialAccount.id, existing[0].id));
    } else {
      await db.insert(socialAccount).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        platform: "instagram",
        platformAccountId: igAccountId,
        accountName,
        accountAvatar,
        accessToken,
        tokenExpiresAt,
        metadata: JSON.stringify({ followers, posts, pageToken }),
      });
    }

    // Redirect back to socials page
    return NextResponse.redirect(`${origin}/socials?connected=instagram`);

  } catch (err) {
    console.error("Instagram OAuth callback error:", err);
    return NextResponse.redirect(`${origin}/socials?error=instagram_auth_exception`);
  }
}
