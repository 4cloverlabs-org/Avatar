import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contentStrategy, video } from '@/db/schema';
import { eq, desc, sum, count } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // We'll mock the user ID for this demo since we don't have the auth token easily accessible here
    const userId = 'user_mock_123';

    // 1. Total Views
    const totalViewsRes = await db.select({
      sumViews: sql<number>`sum(CAST(${video.views} AS INTEGER))`
    }).from(video);
    
    // 2. Total Likes and Shares for Engagement Rate
    const totalEngagementsRes = await db.select({
      sumLikes: sql<number>`sum(CAST(${video.likes} AS INTEGER))`,
      sumShares: sql<number>`sum(CAST(${video.shares} AS INTEGER))`
    }).from(video);

    const totalViews = Number(totalViewsRes[0]?.sumViews || 0);
    const totalLikes = Number(totalEngagementsRes[0]?.sumLikes || 0);
    const totalShares = Number(totalEngagementsRes[0]?.sumShares || 0);
    
    let engagementRate = 0;
    if (totalViews > 0) {
      engagementRate = ((totalLikes + totalShares) / totalViews) * 100;
    }

    // 3. Active Strategies
    const activeStrategiesRes = await db.select({
      count: count()
    }).from(contentStrategy);
    const activeStrategies = activeStrategiesRes[0]?.count || 0;

    // 4. Videos Published
    const videosPublishedRes = await db.select({
      count: count()
    }).from(video).where(eq(video.status, 'Published'));
    const videosPublished = videosPublishedRes[0]?.count || 0;

    // 5. Platform Breakdown
    const platformRes = await db.select({
      platform: video.platform,
      views: sql<number>`sum(CAST(${video.views} AS INTEGER))`
    }).from(video).groupBy(video.platform);

    let platformBreakdown: any = { TikTok: 0, 'YouTube Shorts': 0, 'Instagram Reels': 0 };
    platformRes.forEach(p => {
      const pct = totalViews > 0 ? (p.views / totalViews) * 100 : 0;
      platformBreakdown[p.platform] = pct;
    });

    // 6. Recent Videos
    const recentVideosRes = await db.select({
      id: video.id,
      title: video.title,
      platform: video.platform,
      status: video.status,
      views: video.views,
      likes: video.likes,
      shares: video.shares,
      niche: contentStrategy.niche,
      contentStyle: contentStrategy.contentStyle
    })
    .from(video)
    .leftJoin(contentStrategy, eq(video.strategyId, contentStrategy.id))
    .orderBy(desc(video.createdAt))
    .limit(3);

    // 7. Top Performing Niche
    const nicheRes = await db.select({
      niche: contentStrategy.niche,
      totalEngagements: sql<number>`sum(CAST(${video.likes} AS INTEGER) + CAST(${video.shares} AS INTEGER))`
    })
    .from(video)
    .innerJoin(contentStrategy, eq(video.strategyId, contentStrategy.id))
    .groupBy(contentStrategy.niche)
    .orderBy(desc(sql`sum(CAST(${video.likes} AS INTEGER) + CAST(${video.shares} AS INTEGER))`))
    .limit(1);

    const bestNiche = nicheRes[0]?.niche || 'N/A';

    // 8. Top Performing Style
    const styleRes = await db.select({
      style: contentStrategy.contentStyle,
      totalEngagements: sql<number>`sum(CAST(${video.likes} AS INTEGER) + CAST(${video.shares} AS INTEGER))`
    })
    .from(video)
    .innerJoin(contentStrategy, eq(video.strategyId, contentStrategy.id))
    .groupBy(contentStrategy.contentStyle)
    .orderBy(desc(sql`sum(CAST(${video.likes} AS INTEGER) + CAST(${video.shares} AS INTEGER))`))
    .limit(1);

    const bestStyle = styleRes[0]?.style || 'N/A';
    
    // Return structured response
    return NextResponse.json({
      success: true,
      metrics: {
        totalViews: totalViews >= 1000000 ? (totalViews / 1000000).toFixed(1) + 'M' : totalViews,
        activeStrategies,
        videosPublished,
        avgEngagement: engagementRate.toFixed(1) + '%'
      },
      platformBreakdown: {
        tiktok: Math.round(platformBreakdown['TikTok'] || 0),
        youtube: Math.round(platformBreakdown['YouTube Shorts'] || 0),
        instagram: Math.round(platformBreakdown['Instagram Reels'] || 0)
      },
      topPerforming: {
        niche: bestNiche,
        style: bestStyle
      },
      recentVideos: recentVideosRes
    });

  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
