import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  try {
    await pool.query(`
      ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "phone_number" text;
    `);
    console.log("phone_number column added successfully");
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

main();
