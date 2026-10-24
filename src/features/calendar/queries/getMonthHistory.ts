import { sql } from "drizzle-orm";

import type { Weekday } from "@/domain/intake";
import type { IntakeLog } from "@/domain/intakeLog";
import { intakeLogTable, intakeMedTable, intakeTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import type { IntakeVersion, Month } from "@/features/calendar/utils/calendarTypes";
import { firstDayOf, shiftMonth } from "@/features/calendar/utils/months";

export type MonthHistory = {
  intakeVersions: IntakeVersion[];
  intakeLogs: IntakeLog[];
};

type IntakeVersionRecord = {
  id: string;
  hour: number;
  minute: number;
  days: string;
  createdOn: string;
  archivedOn: string | null;
};

export function getMonthHistory(database: Database, month: Month): MonthHistory {
  const firstDay = firstDayOf(month);
  const nextMonthFirstDay = firstDayOf(shiftMonth(month, 1));

  const records = database.all<IntakeVersionRecord>(sql`
    SELECT
      ${intakeTable.id} AS id,
      ${intakeTable.hour} AS hour,
      ${intakeTable.minute} AS minute,
      ${intakeTable.days} AS days,
      ${intakeTable.createdOn} AS createdOn,
      ${intakeTable.archivedOn} AS archivedOn
    FROM ${intakeTable}
    WHERE ${intakeTable.createdOn} < ${nextMonthFirstDay}
      AND (${intakeTable.archivedOn} IS NULL OR ${intakeTable.archivedOn} > ${firstDay})
      AND EXISTS (SELECT 1 FROM ${intakeMedTable} WHERE ${intakeMedTable.intakeId} = ${intakeTable.id})
    ORDER BY ${intakeTable.hour}, ${intakeTable.minute}
  `);

  const intakeLogs = database.all<IntakeLog>(sql`
    SELECT
      ${intakeLogTable.id} AS id,
      ${intakeLogTable.intakeId} AS intakeId,
      ${intakeLogTable.expectedIntakeAt} AS expectedIntakeAt,
      ${intakeLogTable.createdAt} AS createdAt,
      ${intakeLogTable.status} AS status
    FROM ${intakeLogTable}
    WHERE ${intakeLogTable.expectedIntakeAt} >= ${firstDay}
      AND ${intakeLogTable.expectedIntakeAt} < ${nextMonthFirstDay}
    ORDER BY ${intakeLogTable.expectedIntakeAt}
  `);

  return {
    intakeVersions: records.map(({ hour, minute, days, ...version }) => ({
      ...version,
      time: { hour, minute },
      days: JSON.parse(days) as Weekday[],
    })),
    intakeLogs,
  };
}
