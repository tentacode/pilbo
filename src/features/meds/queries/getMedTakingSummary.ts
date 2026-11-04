import { sql } from "drizzle-orm";

import { intakeLogTable, intakeMedTable, medLogTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export type MedTakingSummary = {
  todayQuantity: number;
  lastTakenAt?: string;
};

type MedTakingSummaryRecord = {
  todayQuantity: number;
  lastTakenAt: string | null;
};

export function getMedTakingSummary(
  database: Database,
  medId: string,
  localDate: string,
): MedTakingSummary {
  const record = database.get<MedTakingSummaryRecord>(sql`
    SELECT
      COALESCE(SUM(CASE WHEN takenAt LIKE ${localDate} || '%' THEN quantity ELSE 0 END), 0)
        AS todayQuantity,
      MAX(takenAt) AS lastTakenAt
    FROM (
      SELECT ${medLogTable.takenAt} AS takenAt, 1 AS quantity
      FROM ${medLogTable}
      WHERE ${medLogTable.medId} = ${medId}
      UNION ALL
      SELECT ${intakeLogTable.createdAt} AS takenAt, ${intakeMedTable.quantity} AS quantity
      FROM ${intakeLogTable}
      INNER JOIN ${intakeMedTable} ON ${intakeMedTable.intakeId} = ${intakeLogTable.intakeId}
      WHERE ${intakeMedTable.medId} = ${medId} AND ${intakeLogTable.status} = 'taken'
    )
  `);
  return {
    todayQuantity: record.todayQuantity,
    lastTakenAt: record.lastTakenAt ?? undefined,
  };
}
