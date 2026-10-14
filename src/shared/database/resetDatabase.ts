import { clearDatabase } from "./clearDatabase";
import { seedDatabase, type SeedOptions } from "./seed";
import type { Database } from "./types";

export function resetDatabase(database: Database, options: SeedOptions): void {
  clearDatabase(database);
  seedDatabase(database, options);
}
