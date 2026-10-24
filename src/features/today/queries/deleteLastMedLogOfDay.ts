import { sql } from "drizzle-orm";

import { medLogTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function deleteLastMedLogOfDay(
  database: Database,
  medId: string,
  localDate: string,
): boolean {
  const lastMedLog = database.get<{ id: string } | undefined>(sql`
    SELECT ${medLogTable.id} AS id
    FROM ${medLogTable}
    WHERE ${medLogTable.medId} = ${medId} AND ${medLogTable.takenAt} LIKE ${localDate} || '%'
    ORDER BY ${medLogTable.takenAt} DESC, rowid DESC
    LIMIT 1
  `);
  if (lastMedLog === undefined) {
    return false;
  }
  database
    .delete(medLogTable)
    .where(sql`${medLogTable.id} = ${lastMedLog.id}`)
    .run();
  return true;
}
