import { type SQL, sql } from "drizzle-orm";

import type { Intake, IntakeFrequency, IntakeRecurrence, Weekday } from "@/domain/intake";
import { toNotificationSound } from "@/domain/sound";
import { intakeMedTable, intakeTable, medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { toMed } from "./medRecord";

export type IntakeRecurrenceRecord = {
  days: string;
  frequency: IntakeFrequency;
  interval: number;
  startsOn: string;
};

export function toIntakeRecurrence({
  days,
  frequency,
  interval,
  startsOn,
}: IntakeRecurrenceRecord): IntakeRecurrence {
  return { days: JSON.parse(days) as Weekday[], frequency, interval, startsOn };
}

type IntakeMedRecord = IntakeRecurrenceRecord & {
  intakeId: string;
  hour: number;
  minute: number;
  reminderIntervalMinutes: number;
  sound: string;
  medId: string | null;
  medName: string;
  medStrength: string;
  medDetail: string;
  medDesign: string;
  quantity: number;
};

export function selectActiveIntakes(database: Database, condition: SQL = sql`1 = 1`): Intake[] {
  const records = database.all<IntakeMedRecord>(sql`
    SELECT
      ${intakeTable.id} AS intakeId,
      ${intakeTable.hour} AS hour,
      ${intakeTable.minute} AS minute,
      ${intakeTable.days} AS days,
      ${intakeTable.frequency} AS frequency,
      ${intakeTable.interval} AS interval,
      ${intakeTable.startsOn} AS startsOn,
      ${intakeTable.reminderIntervalMinutes} AS reminderIntervalMinutes,
      ${intakeTable.sound} AS sound,
      ${medTable.id} AS medId,
      ${medTable.name} AS medName,
      ${medTable.strength} AS medStrength,
      ${medTable.detail} AS medDetail,
      ${medTable.design} AS medDesign,
      ${intakeMedTable.quantity} AS quantity
    FROM ${intakeTable}
    LEFT JOIN ${intakeMedTable} ON ${intakeMedTable.intakeId} = ${intakeTable.id}
    LEFT JOIN ${medTable} ON ${medTable.id} = ${intakeMedTable.medId}
    WHERE ${intakeTable.isArchived} = 0 AND ${condition}
    ORDER BY ${intakeTable.hour}, ${intakeTable.minute}
  `);

  const intakes = new Map<string, Intake>();
  for (const record of records) {
    const intake = intakes.get(record.intakeId) ?? {
      id: record.intakeId,
      time: { hour: record.hour, minute: record.minute },
      ...toIntakeRecurrence(record),
      reminderIntervalMinutes: record.reminderIntervalMinutes,
      sound: toNotificationSound(record.sound),
      medQuantities: [],
    };
    intakes.set(record.intakeId, intake);

    if (record.medId !== null) {
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
  }
  return [...intakes.values()];
}
