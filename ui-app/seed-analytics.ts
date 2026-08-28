import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './src/db/schema';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const db = drizzle(pool, { schema });

async function seed() {
  console.log('Seeding database with analytics data...');

  // 1. Get or create a mock user
  const mockUserId = 'user_mock_123';
  await db.insert(schema.user).values({
    id: mockUserId,
    name: 'Demo User',
    email: 'demo@example.com',
  }).onConflictDoNothing();

  // 2. Create 3 Active Strategies
  const strat1Id = crypto.randomUUID();
  const strat2Id = crypto.randomUUID();
  const strat3Id = crypto.randomUUID();

  await db.insert(schema.contentStrategy).values([
    {
      id: strat1Id,
      userId: mockUserId,
      niche: 'Technology & Gadgets',
      durationValue: '20',
      durationUnit: 'Days',
      contentStyle: 'Educational',
      frequency: '1 video per day',
      platforms: JSON.stringify(['TikTok']),
    },
    {
      id: strat2Id,
      userId: mockUserId,
      niche: 'Finance & Crypto',
      durationValue: '1',
      durationUnit: 'Months',
      contentStyle: 'Entertaining',
      frequency: '2 videos per week',
      platforms: JSON.stringify(['YouTube Shorts']),
    },
    {
      id: strat3Id,
      userId: mockUserId,
      niche: 'Lifestyle & Vlogs',
      durationValue: '10',
      durationUnit: 'Days',
      contentStyle: 'Casual',
      frequency: '3 videos per week',
      platforms: JSON.stringify(['Instagram Reels']),
    }
  ]).onConflictDoNothing();

  // 3. Create Recent Videos (The 3 specific ones mentioned)
  await db.insert(schema.video).values([
    {
      id: crypto.randomUUID(),
      userId: mockUserId,
      strategyId: strat1Id,
      title: 'Top 5 Tech Gadgets 2026',
      platform: 'TikTok',
      status: 'Published',
      views: '245200',
      likes: '12400',
      shares: '3200'
    },
    {
      id: crypto.randomUUID(),
      userId: mockUserId,
      strategyId: strat2Id,
      title: 'Is Crypto Bouncing Back?',
      platform: 'YouTube Shorts',
      status: 'Published',
      views: '89100',
      likes: '4500',
      shares: '890'
    },
    {
      id: crypto.randomUUID(),
      userId: mockUserId,
      strategyId: strat3Id,
      title: 'Daily Vlog #14',
      platform: 'Instagram Reels',
      status: 'Scheduled',
      views: '0',
      likes: '0',
      shares: '0'
    }
  ]).onConflictDoNothing();

  // 4. Create 121 more fake published videos to reach 124 total published videos
  const extraVideos = [];
  let totalViewsSoFar = 245200 + 89100; // 334,300
  const targetViews = 1200000; // 1.2M
  const remainingViews = targetViews - totalViewsSoFar;
  
  // 121 videos to distribute ~865,700 views
  const avgViewsPerVideo = Math.floor(remainingViews / 121);

  for (let i = 0; i < 121; i++) {
    // Randomize platform distribution roughly 65% TikTok, 25% YT, 10% IG
    let platform = 'TikTok';
    let stratId = strat1Id;
    const r = Math.random();
    if (r > 0.65 && r <= 0.90) {
      platform = 'YouTube Shorts';
      stratId = strat2Id;
    } else if (r > 0.90) {
      platform = 'Instagram Reels';
      stratId = strat3Id;
    }

    const views = Math.floor(avgViewsPerVideo * (0.5 + Math.random()));
    const likes = Math.floor(views * 0.084); // ~8.4% engagement
    const shares = Math.floor(likes * 0.2);

    extraVideos.push({
      id: crypto.randomUUID(),
      userId: mockUserId,
      strategyId: stratId,
      title: `Generated Video #${i + 100}`,
      platform,
      status: 'Published',
      views: String(views),
      likes: String(likes),
      shares: String(shares)
    });
  }

  // Insert in batches of 50
  for (let i = 0; i < extraVideos.length; i += 50) {
    await db.insert(schema.video).values(extraVideos.slice(i, i + 50)).onConflictDoNothing();
  }

  console.log('Seeding complete! 3 Strategies and 124 Videos created.');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
