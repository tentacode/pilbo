import { sql } from "drizzle-orm";

import { intakeLogTable, intakeMedTable, intakeTable, medTable } from "./schema";
import type { Database } from "./types";

export function countRows(
  database: Database,
  table: typeof medTable | typeof intakeTable | typeof intakeMedTable | typeof intakeLogTable,
): number {
  return database.get<{ count: number }>(sql`SELECT COUNT(*) AS count FROM ${table}`).count;
}
