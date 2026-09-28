import { db } from "../db";
import { scriptEmbedding } from "../../db/schema";
import { eq, and, gte } from "drizzle-orm";

export const SIMILARITY_THRESHOLD = 0.85;
export const MAX_REGEN_ATTEMPTS = 3;

import { pipeline } from '@xenova/transformers';

class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance: any = null;

    static async getInstance(progress_callback: any = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

async function embedText(text: string): Promise<number[]> {
  const embedder = await PipelineSingleton.getInstance();
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

export interface SimilarityResult {
  passed: boolean;
  maxSimilarity: number;
  nearestMatchSummary?: string;
}

/**
 * Checks a script against:
 *  - this user's own scripts from the last 30 days (self-repetition guard)
 *  - the whole niche cohort's scripts from the last 14 days (cross-user guard)
 * On failure, nearestMatchSummary is short enough to feed back into the
 * next generation attempt as a negative constraint.
 */
export async function checkScriptSimilarity(
  scriptText: string,
  userId: string,
  niche: string
): Promise<SimilarityResult> {
  const embedding = await embedText(scriptText);

  const ownHistory = await db
    .select()
    .from(scriptEmbedding)
    .where(and(eq(scriptEmbedding.userId, userId), gte(scriptEmbedding.createdAt, daysAgo(30))));

  const nicheCohort = await db
    .select()
    .from(scriptEmbedding)
    .where(and(eq(scriptEmbedding.niche, niche), gte(scriptEmbedding.createdAt, daysAgo(14))));

  const pool = [...ownHistory, ...nicheCohort];

  let maxSimilarity = 0;
  let nearestMatchSummary: string | undefined;

  for (const entry of pool) {
    const sim = cosineSimilarity(embedding, entry.embedding as number[]);
    if (sim > maxSimilarity) {
      maxSimilarity = sim;
      nearestMatchSummary = entry.hookSummary;
    }
  }

  return {
    passed: maxSimilarity <= SIMILARITY_THRESHOLD,
    maxSimilarity,
    nearestMatchSummary,
  };
}

/**
 * Call only after a script has passed QA + the similarity gate — stores it
 * as part of the corpus future scripts get checked against.
 */
export async function storeScriptEmbedding(
  generatedScriptId: string,
  userId: string,
  niche: string,
  scriptText: string
): Promise<void> {
  const embedding = await embedText(scriptText);
  const hookSummary = scriptText.slice(0, 200);

  await db.insert(scriptEmbedding).values({
    id: `emb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    generatedScriptId,
    userId,
    niche,
    embedding,
    hookSummary,
    createdAt: new Date(),
  });
}
