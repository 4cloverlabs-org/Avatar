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
    return NextResponse.redirect(`${origin}/socials?error=facebook_auth_failed`);
  }

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const clientId = process.env.META_CLIENT_ID;
  const clientSecret = process.env.META_CLIENT_SECRET;
  const redirectUri = `${origin}/api/socials/facebook/callback`;

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
      return NextResponse.redirect(`${origin}/socials?error=facebook_token_failed`);
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

    // 4. Just pick the first Facebook Page for now
    const selectedPage = pagesData.data[0];
    const pageId = selectedPage.id;
    const pageToken = selectedPage.access_token; // Important: we use the page token to act as the page

    // 5. Fetch Facebook Page Details (avatar, followers)
    const pageInfoRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=name,picture.type(large),followers_count,fan_count&access_token=${pageToken}`);
    const pageInfoData = await pageInfoRes.json();

    const accountName = pageInfoData.name || selectedPage.name || "Facebook Page";
    const accountAvatar = pageInfoData.picture?.data?.url || "";
    const followers = pageInfoData.followers_count || pageInfoData.fan_count || 0;
    const posts = 0; // Graph API doesn't easily return total post count without paging

    // 6. Save to database
    // Check if user already has this specific FB page connected
    const existing = await db
      .select()
      .from(socialAccount)
      .where(
        and(
          eq(socialAccount.platform, "facebook"),
          eq(socialAccount.platformAccountId, pageId)
        )
      );

    const tokenExpiresAt = new Date(Date.now() + (longTokenData.expires_in || 5184000) * 1000); // Defaults to 60 days

    if (existing.length > 0) {
      await db
        .update(socialAccount)
        .set({
          accountName,
          accountAvatar,
          accessToken: pageToken, // Save the PAGE token so we can publish!
          tokenExpiresAt,
          metadata: JSON.stringify({ followers, posts, userAccessToken: accessToken }),
        })
        .where(eq(socialAccount.id, existing[0].id));
    } else {
      await db.insert(socialAccount).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        platform: "facebook",
        platformAccountId: pageId,
        accountName,
        accountAvatar,
        accessToken: pageToken,
        tokenExpiresAt,
        metadata: JSON.stringify({ followers, posts, userAccessToken: accessToken }),
      });
    }

    // Redirect back to socials page
    return NextResponse.redirect(`${origin}/socials?connected=facebook`);

  } catch (err) {
    console.error("Facebook OAuth callback error:", err);
    return NextResponse.redirect(`${origin}/socials?error=facebook_auth_exception`);
  }
}
