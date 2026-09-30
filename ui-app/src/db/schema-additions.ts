// Add these table definitions to your existing db/schema.ts (drizzle-orm).
// Adjust the pg-core import path/dialect if you're not on Postgres.
// This file is a standalone reference — jobs.ts and the new service modules
// import from "../db/schema-additions" as a placeholder; once merged into
// your real schema.ts, update those import paths to point there instead.

import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

// Shared, niche-scoped pool of scraped topics. Populated by the existing
// fetchTrendingTopics / runScraperForNiche job — that job should insert here
// instead of (or in addition to) wherever it currently writes results.
export const topicPool = pgTable("topic_pool", {
  id: text("id").primaryKey(),
  niche: text("niche").notNull(),
  title: text("title").notNull(),
  sourceUrl: text("source_url"),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// One row per user-claims-a-topic event. Used both for the self-repetition
// guard and the cross-user cooldown/max-claims check.
export const topicClaim = pgTable("topic_claim", {
  id: text("id").primaryKey(),
  topicId: text("topic_id").notNull(),
  userId: text("user_id").notNull(),
  niche: text("niche").notNull(),
  angle: jsonb("angle").notNull(), // { perspective, tone, format }
  claimedAt: timestamp("claimed_at").defaultNow().notNull(),
});

// One row per accepted (QA + similarity passed) script. embedding is stored
// as jsonb here for portability — swap to the `vector` type from
// drizzle-orm/pg-core (with the pgvector extension) if you want indexed
// nearest-neighbor search instead of the in-app cosine loop in similarity.ts.
export const scriptEmbedding = pgTable("script_embedding", {
  id: text("id").primaryKey(),
  generatedScriptId: text("generated_script_id").notNull(),
  userId: text("user_id").notNull(),
  niche: text("niche").notNull(),
  embedding: jsonb("embedding").notNull(), // number[]
  hookSummary: text("hook_summary").notNull(), // short excerpt, used for regen feedback
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
