import { sql } from "drizzle-orm";

import type { IntakeLog } from "@/domain/intakeLog";
import { intakeLogTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function getIntakeLogsOfDay(database: Database, localDate: string): IntakeLog[] {
  return database.all<IntakeLog>(sql`
    SELECT
      ${intakeLogTable.id} AS id,
      ${intakeLogTable.intakeId} AS intakeId,
      ${intakeLogTable.expectedIntakeAt} AS expectedIntakeAt,
      ${intakeLogTable.createdAt} AS createdAt,
      ${intakeLogTable.status} AS status
    FROM ${intakeLogTable}
    WHERE ${intakeLogTable.expectedIntakeAt} LIKE ${localDate} || '%'
    ORDER BY ${intakeLogTable.expectedIntakeAt}
  `);
}
