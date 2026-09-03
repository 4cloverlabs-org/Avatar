import { db } from "@/lib/db";
import { topicPool, contentStrategy, generatedScript } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "MOCK_KEY";
const NEWS_API_KEY = process.env.NEWS_API_KEY || "MOCK_KEY";

// Fuzzy dedup check
async function isTopicDuplicate(title: string, niche: string): Promise<boolean> {
  // Simple exact match check for MVP, you would typically use an LLM or pg_trgm in production
  const existing = await db
    .select()
    .from(topicPool)
    .where(and(eq(topicPool.niche, niche), eq(topicPool.title, title)))
    .limit(1);
    
  return existing.length > 0;
}

export async function scrapeYouTube(niche: string, keywords: string) {
  console.log(`Scraping YouTube for niche: ${niche}...`);
  // If no API key, mock data
  if (YOUTUBE_API_KEY === "MOCK_KEY") {
    return [
      {
        title: `The Future of ${niche} - 2026 Updates!`,
        url: `https://youtube.com/watch?v=mock123_${Date.now()}`,
        source: "YouTube",
        engagement: 8500
      }
    ];
  }
  
  // Real fetch (commented out/simplified for safety if key is missing)
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keywords)}&type=video&order=viewCount&key=${YOUTUBE_API_KEY}`);
  const data = await res.json();
  
  if (!data.items) return [];
  
  return data.items.map((item: any) => ({
    title: item.snippet.title,
    url: `https://youtube.com/watch?v=${item.id.videoId}`,
    source: "YouTube",
    engagement: 1000 // Mocking engagement as search API doesn't return views directly
  }));
}

export async function scrapeNews(niche: string, keywords: string) {
  console.log(`Scraping News for niche: ${niche}...`);
  if (NEWS_API_KEY === "MOCK_KEY") {
    return [
      {
        title: `Breaking: Major announcement in ${niche} industry`,
        url: `https://news.example.com/article_${Date.now()}`,
        source: "NewsAPI",
        engagement: 4200
      }
    ];
  }
  
  // Real fetch
  const res = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&sortBy=popularity&apiKey=${NEWS_API_KEY}`);
  const data = await res.json();
  
  if (!data.articles) return [];
  
  return data.articles.slice(0, 5).map((article: any) => ({
    title: article.title,
    url: article.url,
    source: "NewsAPI",
    engagement: 500
  }));
}

export async function runScraperForNiche(niche: string) {
  const ytData = await scrapeYouTube(niche, niche);
  const newsData = await scrapeNews(niche, niche);
  
  const allData = [...ytData, ...newsData];
  
  for (const item of allData) {
    const isDup = await isTopicDuplicate(item.title, niche);
    
    if (isDup) {
      // Just update cross platform / engagement if dup
      await db.update(topicPool)
        .set({ crossPlatform: true, engagementSignal: sql`${topicPool.engagementSignal} + ${item.engagement}` })
        .where(and(eq(topicPool.niche, niche), eq(topicPool.title, item.title)));
    } else {
      // Insert new
      await db.insert(topicPool).values({
        id: `topic_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        niche: niche,
        title: item.title,
        url: item.url,
        source: item.source,
        engagementSignal: item.engagement,
        recencyScore: 100, // Starts at 100, decays over time
        velocityScore: item.engagement / 100, // Simple heuristic
        totalScore: 100 + (item.engagement / 100),
        status: "available"
      });
    }
  }
  
  return allData.length;
}

export async function selectNextTopicForStrategy(strategyId: string, userId: string, niche: string) {
  // Step 1: Find all topic IDs already used by this user (Cross-Strategy Repetition Guard)
  const usedScripts = await db
    .select({ topicId: generatedScript.topicId })
    .from(generatedScript)
    .where(eq(generatedScript.userId, userId));
    
  const usedTopicIds = usedScripts.map(s => s.topicId).filter(Boolean) as string[];
  
  // Step 2: Query for highest scored available topic NOT in used list
  let query = db
    .select()
    .from(topicPool)
    .where(
      and(
        eq(topicPool.niche, niche),
        eq(topicPool.status, "available")
      )
    );
    
  const availableTopics = await query;
  
  // In-memory filter for SQLite/pg compatibility in this simplified Drizzle query
  const unusedTopics = availableTopics.filter(t => !usedTopicIds.includes(t.id));
  
  if (unusedTopics.length === 0) {
    return null;
  }
  
  // Sort by total score
  unusedTopics.sort((a, b) => b.totalScore - a.totalScore);
  
  return unusedTopics[0];
}
