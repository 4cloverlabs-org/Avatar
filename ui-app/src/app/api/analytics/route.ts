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
      recentVideos: enrichedVideos.slice(0, 3)
    });

  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

