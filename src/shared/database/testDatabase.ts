import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import BetterSqlite3 from "better-sqlite3";
import { type BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import { seedDatabase } from "./seed";
import type { Database } from "./types";

// Fixed so that the seeded intakes exist on every date used by the tests.
const SEED_DATE = new Date(2026, 0, 1);

const MIGRATIONS_FOLDER = path.join(__dirname, "migrations");

type TestDatabaseOptions = {
  seed?: boolean;
  withLogs?: boolean;
  now?: Date;
  lastMigrationTag?: string;
};

type MigrationJournal = {
  entries: { tag: string }[];
};

function createMigrationsFolderUpTo(lastMigrationTag: string): string {
  const journalPath = path.join(MIGRATIONS_FOLDER, "meta", "_journal.json");
  const journal = JSON.parse(fs.readFileSync(journalPath, "utf8")) as MigrationJournal;
  const lastIndex = journal.entries.findIndex(({ tag }) => tag === lastMigrationTag);
  if (lastIndex === -1) {
    throw new Error(`Unknown migration: ${lastMigrationTag}`);
  }
  const entries = journal.entries.slice(0, lastIndex + 1);
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), "pilbo-migrations-"));
  fs.mkdirSync(path.join(folder, "meta"));
  fs.writeFileSync(
    path.join(folder, "meta", "_journal.json"),
    JSON.stringify({ ...journal, entries }),
  );
  for (const { tag } of entries) {
    fs.copyFileSync(path.join(MIGRATIONS_FOLDER, `${tag}.sql`), path.join(folder, `${tag}.sql`));
  }
  return folder;
}

export function migrateTestDatabase(database: Database): void {
  migrate(database as BetterSQLite3Database, { migrationsFolder: MIGRATIONS_FOLDER });
}

export function createTestDatabase({
  seed = true,
  withLogs = false,
  now = SEED_DATE,
  lastMigrationTag,
}: TestDatabaseOptions = {}): Database {
  const sqlite = new BetterSqlite3(":memory:");
  sqlite.pragma("foreign_keys = ON");
  const database = drizzle(sqlite);
  const migrationsFolder =
    lastMigrationTag === undefined
      ? MIGRATIONS_FOLDER
      : createMigrationsFolderUpTo(lastMigrationTag);
  migrate(database, { migrationsFolder });
  if (seed) {
    seedDatabase(database, { withLogs, now });
  }
  return database;
}
