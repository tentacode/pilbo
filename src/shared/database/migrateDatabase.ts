import { migrate } from "drizzle-orm/expo-sqlite/migrator";

import { database } from "@/shared/database/database";
import migrations from "@/shared/database/migrations/migrations";

let migration: Promise<void> | undefined;

export function migrateDatabase(): Promise<void> {
  migration ??= migrate(database, migrations);
  return migration;
}
