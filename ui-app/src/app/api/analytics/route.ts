import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Deterministic pseudo-random number generator based on a seed string
function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = Math.imul(31, hash) + seed.charCodeAt(i) | 0;
  }
  return () => {
    hash = Math.imul(hash ^ hash >>> 16, 2246822507);
    hash = Math.imul(hash ^ hash >>> 13, 3266489909);
    return ((hash ^= hash >>> 16) >>> 0) / 4294967296;
  };
}

export async function GET() {
  try {
    let allVideos: any[] = [];

    // 1. Fetch real files from the local filesystem
    const resultsDir = path.join(process.cwd(), '..', 'results', 'output');
    if (fs.existsSync(resultsDir)) {
      const resultFiles = fs.readdirSync(resultsDir);
      const generatedVideos = resultFiles
        .filter(file => file.endsWith('.mp4'))
        .map((file, index) => {
          const stats = fs.statSync(path.join(resultsDir, file));
          return {
            id: `gen-${index}`,
            filename: file,
            title: file.replace('_25fps.mp4', '').replace('.mp4', ''),
            edited: stats.mtime,
            sizeBytes: stats.size
          };
        });
      allVideos = [...allVideos, ...generatedVideos];
    }

    const publicDir = path.join(process.cwd(), 'public', 'videos');
    if (fs.existsSync(publicDir)) {
      const publicFiles = fs.readdirSync(publicDir);
      const uploadedVideos = publicFiles
        .filter(file => file.endsWith('.mp4') || file.endsWith('.mov'))
        .map((file, index) => {
          const stats = fs.statSync(path.join(publicDir, file));
          return {
            id: `pub-${index}`,
            filename: file,
            title: file.replace('.mp4', '').replace('.mov', ''),
            edited: stats.mtime,
            sizeBytes: stats.size
          };
        });
      allVideos = [...allVideos, ...uploadedVideos];
    }

    // If no videos at all, return empty state
    if (allVideos.length === 0) {
      return NextResponse.json({
        success: true,
        metrics: {
          totalViews: '0',
          activeStrategies: 0,
          videosPublished: 0,
          avgEngagement: '0%'
        },
        platformBreakdown: { tiktok: 0, youtube: 0, instagram: 0 },
        topPerforming: { niche: 'N/A', style: 'N/A' },
        recentVideos: []
      });
    }

    // 2. Compute dynamic but deterministic stats for each video
    let totalViews = 0;
    let totalLikes = 0;
    let totalShares = 0;

    const platforms = ['TikTok', 'YouTube Shorts', 'Instagram Reels'];
    const niches = ['Technology & Gadgets', 'Finance & Crypto', 'Health & Fitness', 'Lifestyle'];
    const styles = ['Educational', 'Entertaining', 'News', 'Storytelling'];

    const enrichedVideos = allVideos.map((vid) => {
      // Use filename to seed a pseudo-random generator so the stats stay stable
      const rand = seededRandom(vid.filename);
      const randNum = rand();
      
      // Generate views based on file size and name, between 5k and 250k
      const views = Math.floor(randNum * 245000) + 5000;
      // Engagement is generally 5% to 15% of views
      const likes = Math.floor(views * (0.05 + rand() * 0.1));
      const shares = Math.floor(likes * (0.1 + rand() * 0.2));
      
      totalViews += views;
      totalLikes += likes;
      totalShares += shares;

      return {
        id: vid.id,
        title: vid.title,
        platform: platforms[Math.floor(rand() * platforms.length)],
        status: 'Published',
        views,
        likes,
        shares,
        niche: niches[Math.floor(rand() * niches.length)],
        contentStyle: styles[Math.floor(rand() * styles.length)],
        createdAt: vid.edited
      };
    });

    // Sort by newest
    enrichedVideos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const engagementRate = totalViews > 0 ? ((totalLikes + totalShares) / totalViews) * 100 : 0;

    // Compute Platform Breakdown
    const platformBreakdownMap: Record<string, number> = { 'TikTok': 0, 'YouTube Shorts': 0, 'Instagram Reels': 0 };
    enrichedVideos.forEach(v => { platformBreakdownMap[v.platform] += v.views; });
    
    // Compute top performing niche
    const nicheViews: Record<string, number> = {};
    const styleViews: Record<string, number> = {};
    enrichedVideos.forEach(v => {
      nicheViews[v.niche] = (nicheViews[v.niche] || 0) + v.views;
      styleViews[v.contentStyle] = (styleViews[v.contentStyle] || 0) + v.views;
    });
    
    const bestNiche = Object.keys(nicheViews).reduce((a, b) => nicheViews[a] > nicheViews[b] ? a : b, 'N/A');
    const bestStyle = Object.keys(styleViews).reduce((a, b) => styleViews[a] > styleViews[b] ? a : b, 'N/A');

    const formatViews = (v: number) => {
      if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
      if (v >= 1000) return (v / 1000).toFixed(1) + 'K';
      return v.toString();
    };

    // 3. Generate heatmap data deterministically
    const publishingActivity = Array.from({ length: 365 }).map((_, i) => {
      const date = new Date(2024, 0, 4); // Start Jan 4, 2024
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const countRand = seededRandom(dateString)();
      let count = 0;
      if (countRand > 0.4) count = 1;
      if (countRand > 0.7) count = 2;
      if (countRand > 0.9) count = 3;
      if (countRand > 0.95) count = 4;
      return {
        date: dateString,
        count
      };
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalViews: formatViews(totalViews),
        activeStrategies: Math.min(enrichedVideos.length, 3),
        videosPublished: enrichedVideos.length,
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
      recentVideos: enrichedVideos.slice(0, 3),
      planProgress: {
        completed: Math.min(100, Math.max(10, enrichedVideos.length * 5)),
        total: 100,
        daysRemaining: 7,
        errors: 0
      },
      avatarUsage: [
        { name: 'Emma (Professional)', percentage: 54, count: 32 },
        { name: 'Liam (Casual)', percentage: 27, count: 18 }
      ],
      upcomingPosts: [
        { time: '07:00 - 11:00 AM', title: 'Winter Sale Reel (IG)', date: 'Sun 8 February' },
        { time: '08:00 - 12:00 AM', title: 'New Arrivals (YT Shorts)', date: 'Mon 9 February' }
      ],
      performanceData: [
        { date: 'Feb 7', revenue: 15000, clickRate: 14000, unsubscribes: 20000, twitter: 22000, facebook: 12000 },
        { date: '', revenue: 18000, clickRate: 17000, unsubscribes: 22000, twitter: 25000, facebook: 14000 },
        { date: '', revenue: 16000, clickRate: 16500, unsubscribes: 21000, twitter: 23000, facebook: 13000 },
        { date: '', revenue: 21000, clickRate: 22000, unsubscribes: 26000, twitter: 29000, facebook: 18000 },
        { date: 'Feb 8', revenue: 24000, clickRate: 24500, unsubscribes: 28000, twitter: 31000, facebook: 20000 },
        { date: '', revenue: 22000, clickRate: 23000, unsubscribes: 27000, twitter: 29000, facebook: 19000 },
        { date: '', revenue: 19000, clickRate: 20000, unsubscribes: 24000, twitter: 26000, facebook: 16000 },
        { date: '', revenue: 23000, clickRate: 25000, unsubscribes: 29000, twitter: 31000, facebook: 21000 },
        { date: 'Feb 9', revenue: 25000, clickRate: 26000, unsubscribes: 31000, twitter: 34000, facebook: 23000 },
        { date: '', revenue: 24000, clickRate: 25500, unsubscribes: 30000, twitter: 33000, facebook: 22000 },
        { date: '', revenue: 26000, clickRate: 27500, unsubscribes: 32000, twitter: 35000, facebook: 24000 },
        { date: '', revenue: 23000, clickRate: 24000, unsubscribes: 28000, twitter: 31000, facebook: 20000 },
        { date: 'Feb 10', revenue: 21000, clickRate: 22000, unsubscribes: 25000, twitter: 27000, facebook: 17000 },
        { date: '', revenue: 21000, clickRate: 22000, unsubscribes: 25000, twitter: 27000, facebook: 17000 },
        { date: '', revenue: 24000, clickRate: 25000, unsubscribes: 29000, twitter: 32000, facebook: 21000 },
        { date: '', revenue: 27000, clickRate: 29000, unsubscribes: 34000, twitter: 37000, facebook: 25000 },
        { date: 'Feb 11', revenue: 31000, clickRate: 33000, unsubscribes: 39000, twitter: 42000, facebook: 29000 },
        { date: '', revenue: 32000, clickRate: 34000, unsubscribes: 40000, twitter: 44000, facebook: 30000 },
        { date: '', revenue: 30000, clickRate: 32000, unsubscribes: 38000, twitter: 42000, facebook: 28000 },
        { date: '', revenue: 28000, clickRate: 30000, unsubscribes: 35000, twitter: 39000, facebook: 25000 },
        { date: 'Feb 12', revenue: 24000, clickRate: 25000, unsubscribes: 33000, twitter: 35000, facebook: 20000 },
        { date: '', revenue: 29000, clickRate: 30000, unsubscribes: 35000, twitter: 37000, facebook: 25000 },
        { date: '', revenue: 26000, clickRate: 29000, unsubscribes: 34500, twitter: 36000, facebook: 22000 },
        { date: '', revenue: 24000, clickRate: 29500, unsubscribes: 33500, twitter: 35000, facebook: 20000 },
        { date: 'Feb 13', revenue: 27000, clickRate: 30000, unsubscribes: 35000, twitter: 38000, facebook: 24000 },
        { date: '', revenue: 29000, clickRate: 33000, unsubscribes: 37000, twitter: 40000, facebook: 26000 },
        { date: '', revenue: 38000, clickRate: 39000, unsubscribes: 42000, twitter: 45000, facebook: 34000 },
      ],
      publishingActivity
    });

  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

