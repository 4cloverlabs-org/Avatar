import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "two_factor" (
        "id" text PRIMARY KEY NOT NULL,
        "secret" text NOT NULL,
        "backup_codes" text NOT NULL,
        "user_id" text NOT NULL,
        "verified" boolean DEFAULT true,
        "failed_verification_count" integer DEFAULT 0,
        "locked_until" timestamp,
        CONSTRAINT "two_factor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "git_credential" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "name" text NOT NULL,
        "token" text NOT NULL,
        "provider" text DEFAULT 'github',
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "git_credential_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action
      );
    `);
    console.log("Tables created successfully");
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

main();
