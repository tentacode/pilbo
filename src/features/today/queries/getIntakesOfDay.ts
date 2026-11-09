import { sql } from "drizzle-orm";

import type { Intake, Weekday } from "@/domain/intake";
import { toLocalDate } from "@/domain/intakeLog";
import { toNotificationSound } from "@/domain/sound";
import { intakeMedTable, intakeTable, medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { toMed } from "@/features/pillbox/queries/medRecord";
import { weekdayOf } from "@/features/today/utils/computeTodayIntakes";

type IntakeMedOfDayRecord = {
  intakeId: string;
  hour: number;
  minute: number;
  days: string;
  reminderIntervalMinutes: number;
  sound: string;
  medId: string;
  medName: string;
  medStrength: string;
  medDetail: string;
  medDesign: string;
  quantity: number;
};

export function getIntakesOfDay(database: Database, date: Date): Intake[] {
  const localDate = toLocalDate(date);
  const records = database.all<IntakeMedOfDayRecord>(sql`
    SELECT
      ${intakeTable.id} AS intakeId,
      ${intakeTable.hour} AS hour,
      ${intakeTable.minute} AS minute,
      ${intakeTable.days} AS days,
      ${intakeTable.reminderIntervalMinutes} AS reminderIntervalMinutes,
      ${intakeTable.sound} AS sound,
      ${medTable.id} AS medId,
      ${medTable.name} AS medName,
      ${medTable.strength} AS medStrength,
      ${medTable.detail} AS medDetail,
      ${medTable.design} AS medDesign,
      ${intakeMedTable.quantity} AS quantity
    FROM ${intakeTable}
    INNER JOIN ${intakeMedTable} ON ${intakeMedTable.intakeId} = ${intakeTable.id}
    INNER JOIN ${medTable} ON ${medTable.id} = ${intakeMedTable.medId}
    WHERE ${intakeTable.createdOn} <= ${localDate}
      AND (${intakeTable.archivedOn} IS NULL OR ${intakeTable.archivedOn} > ${localDate})
      AND EXISTS (SELECT 1 FROM json_each(${intakeTable.days}) WHERE value = ${weekdayOf(date)})
    ORDER BY ${intakeTable.hour}, ${intakeTable.minute}
  `);

  const intakes = new Map<string, Intake>();
  for (const record of records) {
    const intake = intakes.get(record.intakeId) ?? {
      id: record.intakeId,
      time: { hour: record.hour, minute: record.minute },
      days: JSON.parse(record.days) as Weekday[],
      reminderIntervalMinutes: record.reminderIntervalMinutes,
      sound: toNotificationSound(record.sound),
      medQuantities: [],
    };
    intakes.set(record.intakeId, intake);

    intake.medQuantities.push({
      med: toMed({
        id: record.medId,
        name: record.medName,
        strength: record.medStrength,
        detail: record.medDetail,
        design: record.medDesign,
      }),
      quantity: record.quantity,
    });
  }
  return [...intakes.values()];
}
