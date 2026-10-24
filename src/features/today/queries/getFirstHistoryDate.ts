import { sql } from "drizzle-orm";

import { intakeLogTable, intakeTable, medLogTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

const LOCAL_DATE_LENGTH = "2026-10-14".length;

export function getFirstHistoryDate(database: Database): string | null {
  const { firstDate } = database.get<{ firstDate: string | null }>(sql`
    SELECT MIN(day) AS firstDate
    FROM (
      SELECT MIN(${intakeTable.createdOn}) AS day FROM ${intakeTable}
      UNION ALL
      SELECT MIN(substr(${intakeLogTable.expectedIntakeAt}, 1, ${LOCAL_DATE_LENGTH})) FROM ${intakeLogTable}
      UNION ALL
      SELECT MIN(substr(${medLogTable.takenAt}, 1, ${LOCAL_DATE_LENGTH})) FROM ${medLogTable}
    )
  `);
  return firstDate;
}
