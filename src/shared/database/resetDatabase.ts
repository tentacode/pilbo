import { clearDatabase } from "./clearDatabase";
import { seedDatabase } from "./seed";
import type { Database } from "./types";

export function resetDatabase(database: Database): void {
  clearDatabase(database);
  seedDatabase(database);
}
