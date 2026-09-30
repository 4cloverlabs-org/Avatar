import { db } from "@/lib/db";
import { topicPool, topicClaim } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";

// ---- Angle assignment ----------------------------------------------------
// Assigned per-generation (not fixed per-user) so both cross-user variance
// AND a single user's own output stay varied over time.

const PERSPECTIVES = ["developer", "budget_consumer", "enterprise", "beginner", "contrarian"] as const;
const TONES = ["sarcastic", "enthusiastic", "analytical", "storytelling"] as const;
const FORMATS = ["listicle", "hot_take", "tutorial", "myth_bust"] as const;

export interface Angle {
  perspective: (typeof PERSPECTIVES)[number];
  tone: (typeof TONES)[number];
  format: (typeof FORMATS)[number];
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function angleKey(a: Angle): string {
  return `${a.perspective}|${a.tone}|${a.format}`;
}

/**
 * Assigns an angle, avoiding combos already used for THIS topic when
 * possible (excludeKeys — see leaseTopicForNiche). With 5x4x4 = 80 total
 * combos there's plenty of room; if every combo has genuinely been used
 * already (rare — a topic would need 80+ claims), it falls back to a
 * random pick rather than blocking the lease. The similarity gate at
 * script-generation time is the real backstop against that edge case
 * producing near-duplicate content.
 *
 * personaTonePreference: if a user's persona always speaks in one tone
 * (e.g. "sarcastic"), pass it here to pin that dimension while perspective
 * and format still rotate.
 */
export function assignAngle(
  excludeKeys: Set<string> = new Set(),
  personaTonePreference?: Angle["tone"]
): Angle {
  for (let attempt = 0; attempt < 20; attempt++) {
    const angle: Angle = {
      perspective: pick(PERSPECTIVES),
      tone: personaTonePreference ?? pick(TONES),
      format: pick(FORMATS),
    };
    if (!excludeKeys.has(angleKey(angle))) return angle;
  }
  return {
    perspective: pick(PERSPECTIVES),
    tone: personaTonePreference ?? pick(TONES),
    format: pick(FORMATS),
  };
}

// ---- Topic pool + leasing --------------------------------------------------

// Below this engagement score, a topic is treated as "not really trending" —
// it gets a soft cap on total concurrent users so a low-interest scraped
// item doesn't get spread indefinitely thin. At/above it, there's no cap:
// a genuinely trending topic SHOULD go to many users at once. Tune this
// against your real scraper's engagement numbers (YouTube view counts,
// NewsAPI popularity, etc. are very different scales — normalize upstream
// in scraper.ts if you mix sources).
const TRENDING_ENGAGEMENT_THRESHOLD = 3000;
const MAX_CLAIMS_FOR_NON_TRENDING_TOPIC = 5;

// How far back to look when deciding which angles have already been used
// for a given topic. Long enough to actually diversify, short enough that
// angle history doesn't matter once a story is stale anyway.
const ANGLE_HISTORY_DAYS = 45;

// Cooldown scales inversely with active users in the niche: a niche with
// 5 users can afford a long cooldown per topic, a niche with 200 users needs
// the pool to turn over fast or it starves. This only governs the
// self-repeat guard now (see below) — it no longer caps how many DIFFERENT
// users can share a topic.
function cooldownDaysForNiche(activeUserCount: number): number {
  if (activeUserCount <= 5) return 7;
  if (activeUserCount <= 20) return 3;
  if (activeUserCount <= 50) return 1;
  return 0.5; // 12h
}

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function maxClaimsForTopic(engagement: number | null | undefined): number {
  return (engagement ?? 0) >= TRENDING_ENGAGEMENT_THRESHOLD
    ? Infinity
    : MAX_CLAIMS_FOR_NON_TRENDING_TOPIC;
}

/** Weighted random pick, favoring higher-engagement topics without excluding the rest. */
function weightedPick<T extends { engagement?: number | null }>(items: T[]): T {
  const weights = items.map((i) => Math.max(1, (i.engagement ?? 0) + 1));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export interface LeasedTopic {
  id: string;
  title: string;
  url?: string;
  summary: string;
  angle: Angle;
}

/**
 * Leases a topic from the shared niche pool for this user.
 *
 * What this DOESN'T do anymore: cap how many different users can cover a
 * genuinely trending topic. Trending topics should fan out to many users —
 * that's the whole point of them being trending.
 *
 * What this DOES do:
 *  - Blocks THIS user from getting a topic they've already covered recently
 *    (self-repeat guard, cooldown scales with niche activity).
 *  - Soft-caps total claims only for non-trending topics, so a low-interest
 *    scraped item doesn't get spread across dozens of users.
 *  - Assigns an angle that avoids combos already used for this specific
 *    topic, so even simultaneous coverage of the same trending story reads
 *    differently per user.
 *  - Weights topic selection toward higher engagement, so trending topics
 *    naturally surface more often without forcing them.
 *
 * Returns null if the pool has nothing eligible — caller should trigger a
 * fresh scrape (existing runScraperForNiche) and retry once, rather than
 * looping here.
 */
export async function leaseTopicForNiche(
  niche: string,
  userId: string,
  personaTonePreference?: Angle["tone"]
): Promise<LeasedTopic | null> {
  const candidates = await db.select().from(topicPool).where(eq(topicPool.niche, niche));
  if (candidates.length === 0) return null;

  const angleHistoryClaims = await db
    .select()
    .from(topicClaim)
    .where(and(eq(topicClaim.niche, niche), gte(topicClaim.claimedAt, daysAgo(ANGLE_HISTORY_DAYS))));

  const activeUserCount = new Set(angleHistoryClaims.map((c) => c.userId)).size || 1;
  const cooldownCutoff = daysAgo(cooldownDaysForNiche(activeUserCount));

  const claimsByTopic = new Map<string, typeof angleHistoryClaims>();
  for (const c of angleHistoryClaims) {
    claimsByTopic.set(c.topicId, [...(claimsByTopic.get(c.topicId) ?? []), c]);
  }

  const eligible = candidates.filter((topic) => {
    const claims = claimsByTopic.get(topic.id) ?? [];

    // Self-repeat guard: this exact user shouldn't get this exact topic again soon.
    const usedByThisUserRecently = claims.some(
      (c) => c.userId === userId && c.claimedAt >= cooldownCutoff
    );
    if (usedByThisUserRecently) return false;

    // Soft cap: only applies to non-trending topics. Trending topics (high
    // engagement) have no cap — many users covering them is the goal.
    const cap = maxClaimsForTopic(topic.engagement);
    if (cap !== Infinity && claims.length >= cap) return false;

    return true;
  });

  if (eligible.length === 0) return null;

  const chosen = weightedPick(eligible);

  const usedAngleKeys = new Set(
    (claimsByTopic.get(chosen.id) ?? []).map((c) => angleKey(c.angle as Angle))
  );
  const angle = assignAngle(usedAngleKeys, personaTonePreference);

  await db.insert(topicClaim).values({
    id: `claim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    topicId: chosen.id,
    userId,
    niche,
    angle,
    claimedAt: new Date(),
  });

  return {
    id: chosen.id,
    title: chosen.title,
    url: chosen.sourceUrl ?? undefined,
    summary: chosen.summary,
    angle,
  };
}