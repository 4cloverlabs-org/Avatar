import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
  totpSecret: text("totp_secret"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    issuer: text("issuer").notNull(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("account_issuer_accountId_uidx").on(
      table.issuer,
      table.accountId,
    ),
    index("account_userId_idx").on(table.userId),
  ],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const twoFactor = pgTable(
  "two_factor",
  {
    id: text("id").primaryKey(),
    secret: text("secret").notNull(),
    backupCodes: text("backup_codes").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    verified: boolean("verified").default(true),
    failedVerificationCount: integer("failed_verification_count").default(0),
    lockedUntil: timestamp("locked_until"),
  },
  (table) => [
    index("twoFactor_secret_idx").on(table.secret),
    index("twoFactor_userId_idx").on(table.userId),
  ],
);

export const gitCredential = pgTable(
  "git_credential",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    token: text("token").notNull(),
    provider: text("provider").default("github"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("gitCredential_userId_idx").on(table.userId)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  twoFactors: many(twoFactor),
  gitCredentials: many(gitCredential),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
  user: one(user, {
    fields: [twoFactor.userId],
    references: [user.id],
  }),
}));

export const gitCredentialRelations = relations(gitCredential, ({ one }) => ({
  user: one(user, {
    fields: [gitCredential.userId],
    references: [user.id],
  }),
}));

// ── Social Media Connected Accounts ──────────────────────────────────
export const socialAccount = pgTable(
  "social_account",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    platform: text("platform").notNull(), // "youtube" | "instagram"
    platformAccountId: text("platform_account_id").notNull(),
    accountName: text("account_name").notNull(),
    accountAvatar: text("account_avatar"),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token"),
    tokenExpiresAt: timestamp("token_expires_at"),
    metadata: text("metadata"), // JSON string for subs/followers etc.
    connectedAt: timestamp("connected_at").defaultNow().notNull(),
  },
  (table) => [
    index("social_account_userId_idx").on(table.userId),
    uniqueIndex("social_account_platform_userId_uidx").on(
      table.platform,
      table.userId,
    ),
  ],
);

export const socialAccountRelations = relations(socialAccount, ({ one }) => ({
  user: one(user, {
    fields: [socialAccount.userId],
    references: [user.id],
  }),
}));

// ── Notifications ────────────────────────────────────────────────────
export const notification = pgTable(
  "notification",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: text("type").notNull(), // 'video', 'system', 'account', 'avatar'
    read: boolean("read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("notification_userId_idx").on(table.userId)]
);

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, {
    fields: [notification.userId],
    references: [user.id],
  }),
}));

// ── Settings & Preferences ───────────────────────────────────────────
export const userPreferences = pgTable(
  "user_preferences",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    dashboardTheme: text("dashboard_theme").default("dark").notNull(),
    logExplorerTheme: text("log_explorer_theme").default("match").notNull(),
    highContrastMode: boolean("high_contrast_mode").default(false).notNull(),
  },
  (table) => [index("user_preferences_userId_idx").on(table.userId)]
);

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(user, {
    fields: [userPreferences.userId],
    references: [user.id],
  }),
}));

export const apiKey = pgTable(
  "api_key",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    keyHash: text("key_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    lastUsedAt: timestamp("last_used_at"),
  },
  (table) => [index("api_key_userId_idx").on(table.userId)]
);

export const apiKeyRelations = relations(apiKey, ({ one }) => ({
  user: one(user, {
    fields: [apiKey.userId],
    references: [user.id],
  }),
}));

// ── Workspaces ───────────────────────────────────────────────────────
export const workspace = pgTable(
  "workspace",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    plan: text("plan").default('FREE').notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("workspace_userId_idx").on(table.userId)]
);

export const workspaceRelations = relations(workspace, ({ one }) => ({
  user: one(user, {
    fields: [workspace.userId],
    references: [user.id],
  }),
}));

// ── Campaigns & Analytics ────────────────────────────────────────────
export const campaign = pgTable(
  "campaign",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: text("status").default('Draft').notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("campaign_userId_idx").on(table.userId)]
);

export const campaignRelations = relations(campaign, ({ one, many }) => ({
  user: one(user, {
    fields: [campaign.userId],
    references: [user.id],
  }),
  leads: many(campaignLead),
}));

export const campaignLead = pgTable(
  "campaign_lead",
  {
    id: text("id").primaryKey(),
    campaignId: text("campaign_id")
      .notNull()
      .references(() => campaign.id, { onDelete: "cascade" }),
    firstName: text("first_name").notNull(),
    company: text("company").notNull(),
    email: text("email").notNull(),
    status: text("status").default('Idle').notNull(),
    videoUrl: text("video_url"),
    deliveredAt: timestamp("delivered_at"),
    viewedAt: timestamp("viewed_at"),
    clickedAt: timestamp("clicked_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("campaign_lead_campaignId_idx").on(table.campaignId)]
);

export const campaignLeadRelations = relations(campaignLead, ({ one }) => ({
  campaign: one(campaign, {
    fields: [campaignLead.campaignId],
    references: [campaign.id],
  }),
}));

// ── Content Strategy Planner ─────────────────────────────────────────
export const contentStrategy = pgTable(
  "content_strategy",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    niche: text("niche").notNull(),
    durationValue: text("duration_value").notNull(),
    durationUnit: text("duration_unit").notNull(),
    contentStyle: text("content_style").notNull(),
    frequency: text("frequency").notNull(),
    platforms: text("platforms").notNull(), // JSON string array of platforms
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("content_strategy_userId_idx").on(table.userId)]
);

export const contentStrategyRelations = relations(contentStrategy, ({ one }) => ({
  user: one(user, {
    fields: [contentStrategy.userId],
    references: [user.id],
  }),
}));

// ── Generated Videos ─────────────────────────────────────────────────
export const video = pgTable(
  "video",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    strategyId: text("strategy_id")
      .references(() => contentStrategy.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    platform: text("platform").notNull(),
    status: text("status").default('Scheduled').notNull(), // Published, Scheduled
    views: text("views").default('0').notNull(), // text to handle strings like '1.2M' easily for the demo, or just integer. Let's use integer for real analytics.
    likes: text("likes").default('0').notNull(),
    shares: text("shares").default('0').notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("video_userId_idx").on(table.userId),
    index("video_strategyId_idx").on(table.strategyId)
  ]
);

export const videoRelations = relations(video, ({ one }) => ({
  user: one(user, {
    fields: [video.userId],
    references: [user.id],
  }),
  strategy: one(contentStrategy, {
    fields: [video.strategyId],
    references: [contentStrategy.id],
  }),
}));

// ── Session Handoff ──────────────────────────────────────────────────
export const sessionHandoff = pgTable(
  "session_handoff",
  {
    id: text("id").primaryKey(),
    token: text("token").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("session_handoff_token_idx").on(table.token)]
);

