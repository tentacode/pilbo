import { sql } from "drizzle-orm";

import type { Intake, Weekday } from "@/domain/intake";
import { intakeMedTable, intakeTable, medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { toMed } from "@/features/pillbox/queries/medRecord";

type TodayIntakeMedRecord = {
  intakeId: string;
  hour: number;
  minute: number;
  days: string;
  reminderIntervalMinutes: number;
  medId: string;
  medName: string;
  medStrength: string;
  medDesign: string;
  medIsAsNeeded: number;
  quantity: number;
};

export function getTodayIntakes(database: Database, weekday: Weekday): Intake[] {
  const records = database.all<TodayIntakeMedRecord>(sql`
    SELECT
      ${intakeTable.id} AS intakeId,
      ${intakeTable.hour} AS hour,
      ${intakeTable.minute} AS minute,
      ${intakeTable.days} AS days,
      ${intakeTable.reminderIntervalMinutes} AS reminderIntervalMinutes,
      ${medTable.id} AS medId,
      ${medTable.name} AS medName,
      ${medTable.strength} AS medStrength,
      ${medTable.design} AS medDesign,
      ${medTable.isAsNeeded} AS medIsAsNeeded,
      ${intakeMedTable.quantity} AS quantity
    FROM ${intakeTable}
    INNER JOIN ${intakeMedTable} ON ${intakeMedTable.intakeId} = ${intakeTable.id}
    INNER JOIN ${medTable} ON ${medTable.id} = ${intakeMedTable.medId}
    WHERE EXISTS (SELECT 1 FROM json_each(${intakeTable.days}) WHERE value = ${weekday})
    ORDER BY ${intakeTable.hour}, ${intakeTable.minute}
  `);

  const intakes = new Map<string, Intake>();
  for (const record of records) {
    const intake = intakes.get(record.intakeId) ?? {
      id: record.intakeId,
      time: { hour: record.hour, minute: record.minute },
      days: JSON.parse(record.days) as Weekday[],
      reminderIntervalMinutes: record.reminderIntervalMinutes,
      medQuantities: [],
    };
    intakes.set(record.intakeId, intake);

    intake.medQuantities.push({
      med: toMed({
        id: record.medId,
        name: record.medName,
        strength: record.medStrength,
        design: record.medDesign,
        isAsNeeded: record.medIsAsNeeded,
      }),
      quantity: record.quantity,
    });
  }
  return [...intakes.values()];
}
