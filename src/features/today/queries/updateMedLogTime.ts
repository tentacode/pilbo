import { sql } from "drizzle-orm";

import { medLogTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function updateMedLogTime(database: Database, medLogId: string, takenAt: string): void {
  database
    .update(medLogTable)
    .set({ takenAt })
    .where(sql`${medLogTable.id} = ${medLogId}`)
    .run();
}
