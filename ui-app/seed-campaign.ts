import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from './src/lib/db';
import { campaign, campaignLead, user } from './src/db/schema';
import crypto from 'crypto';

async function seedCampaigns() {
  const users = await db.select().from(user).limit(1);
  if (users.length === 0) {
    console.log("No users found to seed a campaign to.");
    process.exit(1);
  }

  const targetUserId = users[0].id;

  const campaignId = crypto.randomUUID();
  await db.insert(campaign).values({
    id: campaignId,
    userId: targetUserId,
    name: 'Q3 Sales Cold Outreach',
    status: 'Completed',
  });

  const leads = [
    { firstName: 'Sarah', company: 'Google', email: 'sarah.j@google.com', status: 'Ready', videoUrl: 'https://example.com/v1', deliveredAt: new Date(Date.now() - 100000), viewedAt: new Date(), clickedAt: new Date() },
    { firstName: 'Alex', company: 'Meta', email: 'alex.m@meta.com', status: 'Ready', videoUrl: 'https://example.com/v2', deliveredAt: new Date(Date.now() - 200000), viewedAt: new Date(), clickedAt: null },
    { firstName: 'David', company: 'Stripe', email: 'd.webb@stripe.com', status: 'Ready', videoUrl: 'https://example.com/v3', deliveredAt: new Date(Date.now() - 300000), viewedAt: null, clickedAt: null },
    { firstName: 'Emma', company: 'Apple', email: 'emma@apple.com', status: 'Generating', videoUrl: null, deliveredAt: null, viewedAt: null, clickedAt: null },
  ];

  for (const lead of leads) {
    await db.insert(campaignLead).values({
      id: crypto.randomUUID(),
      campaignId: campaignId,
      ...lead
    });
  }

  console.log(`Successfully inserted campaign and leads for user ${users[0].email}`);
  process.exit(0);
}

seedCampaigns();
