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
        engagement: 8500,
        summary: `Mock YouTube summary for ${niche}`
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
    engagement: 1000,
    summary: item.snippet.description || item.snippet.title
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
        engagement: 4200,
        summary: `Mock NewsAPI summary for ${niche}`
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
    engagement: 500,
    summary: article.description || article.title
  }));
}

export async function runScraperForNiche(niche: string) {
  const ytData = await scrapeYouTube(niche, niche);
  const newsData = await scrapeNews(niche, niche);

  const allData = [...ytData, ...newsData];

  await db.insert(topicPool).values(
    allData.map((item) => ({
      id: `topic_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      niche,
      title: item.title,
      sourceUrl: item.url,
      summary: item.summary,
      engagement: item.engagement ?? 0, // lets topic-pool.ts favor + fan out trending topics
      createdAt: new Date(),
    }))
  );

  return allData.length;
}