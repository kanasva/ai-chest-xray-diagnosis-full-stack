import "dotenv/config";
import { db, pool } from "./db-connection";
import { sql } from "drizzle-orm/sql";
import { config } from "@/db/schema";

async function main() {
  // 1. Check if the function exists
  const functionExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT 1 FROM pg_proc WHERE proname = 'update_at'
    );
  `);

  // 2. Create the update timestamp function if it doesn't exist
  if (!functionExists[0].exists) {
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION update_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
  }

  // 3. Check if the trigger for 'users' table exists and create it if not
  const userTriggerExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'set_update_at_users'
    );
  `);

  if (!userTriggerExists[0].exists) {
    await db.execute(sql`
      CREATE TRIGGER set_update_at_users
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_at();
    `);
  }

  // 4. Check if the trigger for 'user_quota' table exists and create it if not
  const quotaTriggerExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'set_update_at_user_quotas'
    );
  `);

  if (!quotaTriggerExists[0].exists) {
    await db.execute(sql`
      CREATE TRIGGER set_update_at_user_quotas
      BEFORE UPDATE ON user_quotas
      FOR EACH ROW
      EXECUTE FUNCTION update_at();
    `);
  }

  // 5. Check if the trigger for 'config' table exists and create it if not
  const configTriggerExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'set_update_at_config'
    );
  `);

  if (!configTriggerExists[0].exists) {
    await db.execute(sql`
      CREATE TRIGGER set_update_at_config
      BEFORE UPDATE ON config
      FOR EACH ROW
      EXECUTE FUNCTION update_at();
    `);
  }

  // 6. Example data insertion (for config table)
  const [user] = await db
    .insert(config)
    .values({
      key: "globalQuota",
      value: "100",
    })
    .onConflictDoNothing()
    .returning();

  // Close the connection pool
  await pool.end();
  console.log("seed successful");
}

main();
