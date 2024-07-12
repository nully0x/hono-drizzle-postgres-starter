import { configDotenv } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

configDotenv();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

async function main() {
  console.log("mirgrating...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("migrated");
}

main().catch((error) => {
  console.error("Error migrating:", error);
  process.exit(1);
});
