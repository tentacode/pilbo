import path from "node:path";

import BetterSqlite3 from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import { seedDatabase } from "./seed";
import type { Database } from "./types";

type TestDatabaseOptions = {
  seed?: boolean;
  withLogs?: boolean;
  now?: Date;
};

export function createTestDatabase({
  seed = true,
  withLogs = false,
  now,
}: TestDatabaseOptions = {}): Database {
  const sqlite = new BetterSqlite3(":memory:");
  sqlite.pragma("foreign_keys = ON");
  const database = drizzle(sqlite);
  migrate(database, { migrationsFolder: path.join(__dirname, "migrations") });
  if (seed) {
    seedDatabase(database, { withLogs, now });
  }
  return database;
}
