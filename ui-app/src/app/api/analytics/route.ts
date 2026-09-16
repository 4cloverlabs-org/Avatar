import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { video, contentStrategy, socialAccount } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user's videos
    const userVideos = await db
      .select()
      .from(video)
      .where(eq(video.userId, userId))
      .orderBy(desc(video.createdAt));

    // Fetch user's strategies
    const userStrategies = await db
      .select()
      .from(contentStrategy)
      .where(eq(contentStrategy.userId, userId));

    if (userVideos.length === 0) {
      return NextResponse.json({
        success: true,
        metrics: {
          totalViews: '0',
          activeStrategies: userStrategies.length,
          videosPublished: 0,
          avgEngagement: '0%'
        },
        platformBreakdown: { tiktok: 0, youtube: 0, instagram: 0 },
        topPerforming: { niche: 'N/A', style: 'N/A' },
        recentVideos: [],
        planProgress: { completed: 0, total: 100, daysRemaining: 30, errors: 0 },
        avatarUsage: [],
        upcomingPosts: [],
        performanceData: [],
        publishingActivity: []
      });
    }

    let totalViews = 0;
    let totalLikes = 0;
    let totalShares = 0;
    let publishedCount = 0;

    const platformBreakdownMap: Record<string, number> = { 'TikTok': 0, 'YouTube Shorts': 0, 'Instagram Reels': 0 };

    const recentVideos = [];
    const upcomingPosts = [];
    
    // Niche and Style usually come from strategy, but strategy is linked via strategyId
    const strategyMap = new Map(userStrategies.map(s => [s.id, s]));

    const nicheViews: Record<string, number> = {};
    const styleViews: Record<string, number> = {};
    const avatarUsageCount: Record<string, number> = {};
    const publishingActivityMap: Record<string, number> = {};
    const performanceDataMap: Record<string, any> = {};

    for (const vid of userVideos) {
      const vViews = parseInt(vid.views || '0', 10);
      const vLikes = parseInt(vid.likes || '0', 10);
      const vShares = parseInt(vid.shares || '0', 10);

      totalViews += vViews;
      totalLikes += vLikes;
      totalShares += vShares;

      if (vid.status === 'Published') {
        publishedCount++;
        
        // Add to recent if we don't have 3 yet
        if (recentVideos.length < 3) {
          recentVideos.push({
            id: vid.id,
            title: vid.title,
            platform: vid.platform,
            status: vid.status,
            views: vViews,
            likes: vLikes,
            shares: vShares,
            createdAt: vid.createdAt
          });
        }
      } else if (vid.status === 'Scheduled') {
        const dateStr = vid.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        upcomingPosts.push({
          time: vid.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: vid.title,
          date: dateStr
        });
      }

      // Map platform names slightly differently if needed
      let pName = vid.platform;
      if (pName.toLowerCase().includes('tiktok')) pName = 'TikTok';
      if (pName.toLowerCase().includes('youtube')) pName = 'YouTube Shorts';
      if (pName.toLowerCase().includes('instagram')) pName = 'Instagram Reels';
      
      platformBreakdownMap[pName] = (platformBreakdownMap[pName] || 0) + vViews;

      const strategy = vid.strategyId ? strategyMap.get(vid.strategyId) : null;
      if (strategy) {
        nicheViews[strategy.niche] = (nicheViews[strategy.niche] || 0) + vViews;
        styleViews[strategy.contentStyle] = (styleViews[strategy.contentStyle] || 0) + vViews;
        if (strategy.avatarId) {
          avatarUsageCount[strategy.avatarId] = (avatarUsageCount[strategy.avatarId] || 0) + 1;
        }
      }

      const dateKey = vid.createdAt.toISOString().split('T')[0];
      publishingActivityMap[dateKey] = (publishingActivityMap[dateKey] || 0) + 1;
      
      // For performance data, just aggregate views/likes by date
      if (!performanceDataMap[dateKey]) {
        performanceDataMap[dateKey] = { date: dateKey, revenue: 0, clickRate: 0, unsubscribes: 0, twitter: 0, facebook: 0 };
      }
      
      // Mock some of these specific channel stats based on actual views since we only have platform views
      if (pName === 'Instagram Reels') performanceDataMap[dateKey].revenue += vViews; // Using 'revenue' as Instagram in frontend
      if (pName === 'YouTube Shorts') performanceDataMap[dateKey].clickRate += vViews;
      if (pName === 'TikTok') performanceDataMap[dateKey].unsubscribes += vViews;
    }

    const engagementRate = totalViews > 0 ? ((totalLikes + totalShares) / totalViews) * 100 : 0;

    const bestNiche = Object.keys(nicheViews).length > 0 ? Object.keys(nicheViews).reduce((a, b) => nicheViews[a] > nicheViews[b] ? a : b) : 'N/A';
    const bestStyle = Object.keys(styleViews).length > 0 ? Object.keys(styleViews).reduce((a, b) => styleViews[a] > styleViews[b] ? a : b) : 'N/A';

    const formatViews = (v: number) => {
      if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
      if (v >= 1000) return (v / 1000).toFixed(1) + 'K';
      return v.toString();
    };

    // Prepare Avatar Usage
    const avatarUsage = Object.entries(avatarUsageCount).map(([id, count]) => ({
      name: id,
      count,
      percentage: Math.round((count / userVideos.length) * 100)
    })).sort((a, b) => b.count - a.count);

    // Prepare Publishing Activity
    const today = new Date();
    const publishingActivity = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      publishingActivity.push({
        date: dateString,
        count: publishingActivityMap[dateString] || 0
      });
    }

    // Prepare Performance Data (last 30 days)
    const performanceData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const pd = performanceDataMap[dateString] || { revenue: 0, clickRate: 0, unsubscribes: 0, twitter: 0, facebook: 0 };
      performanceData.push({
        date: monthDay,
        ...pd
      });
    }

    return NextResponse.json({
      success: true,
      metrics: {
        totalViews: formatViews(totalViews),
        activeStrategies: userStrategies.length,
        videosPublished: publishedCount,
        avgEngagement: engagementRate.toFixed(1) + '%'
      },
      platformBreakdown: {
        tiktok: Math.round((platformBreakdownMap['TikTok'] / totalViews) * 100) || 0,
        youtube: Math.round((platformBreakdownMap['YouTube Shorts'] / totalViews) * 100) || 0,
        instagram: Math.round((platformBreakdownMap['Instagram Reels'] / totalViews) * 100) || 0
      },
      topPerforming: {
        niche: bestNiche,
        style: bestStyle
      },
      recentVideos,
      planProgress: {
        completed: publishedCount,
        total: Math.max(100, publishedCount + upcomingPosts.length),
        daysRemaining: 7,
        errors: 0
      },
      avatarUsage: avatarUsage.length > 0 ? avatarUsage : [
        { name: 'Unknown', percentage: 100, count: userVideos.length }
      ],
      upcomingPosts: upcomingPosts.slice(0, 5),
      performanceData,
      publishingActivity
    });

  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
