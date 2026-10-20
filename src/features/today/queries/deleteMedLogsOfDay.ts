import { sql } from "drizzle-orm";

import { medLogTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function deleteMedLogsOfDay(database: Database, medId: string, localDate: string): void {
  database
    .delete(medLogTable)
    .where(sql`${medLogTable.medId} = ${medId} AND ${medLogTable.takenAt} LIKE ${localDate} || '%'`)
    .run();
}
