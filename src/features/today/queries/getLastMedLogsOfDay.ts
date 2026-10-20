import { sql } from "drizzle-orm";

import { medLogTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

type LastMedLogRecord = {
  medId: string;
  takenAt: string;
};

export function getLastMedLogsOfDay(database: Database, localDate: string): Map<string, string> {
  const records = database.all<LastMedLogRecord>(sql`
    SELECT
      ${medLogTable.medId} AS medId,
      MAX(${medLogTable.takenAt}) AS takenAt
    FROM ${medLogTable}
    WHERE ${medLogTable.takenAt} LIKE ${localDate} || '%'
    GROUP BY ${medLogTable.medId}
  `);
  return new Map(records.map(({ medId, takenAt }) => [medId, takenAt]));
}
