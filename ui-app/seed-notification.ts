import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from './src/lib/db';
import { notification, user } from './src/db/schema';
import crypto from 'crypto';

async function seedNotification() {
  const users = await db.select().from(user).limit(1);
  if (users.length === 0) {
    console.log("No users found to seed a notification to.");
    process.exit(1);
  }

  const targetUserId = users[0].id;

  await db.insert(notification).values({
    id: crypto.randomUUID(),
    userId: targetUserId,
    title: 'Welcome to AvatarApp (Real!)',
    message: 'This is your first real, database-backed notification.',
    type: 'system',
    read: false,
  });

  console.log(`Successfully inserted notification for user ${users[0].email}`);
  process.exit(0);
}

seedNotification();
