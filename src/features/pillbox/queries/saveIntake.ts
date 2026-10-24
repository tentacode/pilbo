import { sql } from "drizzle-orm";

import { type Intake, WEEKDAYS } from "@/domain/intake";
import { toLocalDate } from "@/domain/intakeLog";
import { intakeLogTable, intakeMedTable, intakeTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { getIntakeById } from "./getIntakeById";

export type IntakeToSave = Omit<Intake, "id" | "medQuantities"> & {
  id?: string;
  medQuantities: { medId: string; quantity: number }[];
};

function scheduleSignature(
  time: Intake["time"],
  days: Intake["days"],
  medQuantities: IntakeToSave["medQuantities"],
): string {
  return JSON.stringify({
    time: [time.hour, time.minute],
    days: WEEKDAYS.filter((weekday) => days.includes(weekday)),
    medQuantities: [...medQuantities]
      .sort((first, second) => first.medId.localeCompare(second.medId))
      .map(({ medId, quantity }) => [medId, quantity]),
  });
}

function isScheduleChanged(current: Intake, intake: IntakeToSave): boolean {
  return (
    scheduleSignature(
      current.time,
      current.days,
      current.medQuantities.map(({ med, quantity }) => ({ medId: med.id, quantity })),
    ) !== scheduleSignature(intake.time, intake.days, intake.medQuantities)
  );
}

function hasLogsBefore(database: Database, intakeId: string, localDate: string): boolean {
  const { count } = database.get<{ count: number }>(sql`
    SELECT COUNT(*) AS count
    FROM ${intakeLogTable}
    WHERE ${intakeLogTable.intakeId} = ${intakeId} AND ${intakeLogTable.expectedIntakeAt} < ${localDate}
  `);
  return count > 0;
}

function needsNewVersion(database: Database, intake: IntakeToSave, localDate: string): boolean {
  if (intake.id === undefined) {
    return false;
  }
  const current = getIntakeById(database, intake.id);
  return (
    current !== undefined &&
    isScheduleChanged(current, intake) &&
    hasLogsBefore(database, intake.id, localDate)
  );
}

export function saveIntake(database: Database, intake: IntakeToSave, today: Date): string {
  const localDate = toLocalDate(today);
  const values = {
    hour: intake.time.hour,
    minute: intake.time.minute,
    days: intake.days,
    reminderIntervalMinutes: intake.reminderIntervalMinutes,
  };

  return database.transaction((transaction) => {
    let intakeId: string;
    if (intake.id === undefined || needsNewVersion(transaction, intake, localDate)) {
      intakeId = transaction
        .insert(intakeTable)
        .values({ ...values, createdOn: localDate })
        .returning({ id: intakeTable.id })
        .get().id;
      if (intake.id !== undefined) {
        transaction
          .update(intakeTable)
          .set({ isArchived: true, archivedOn: localDate })
          .where(sql`${intakeTable.id} = ${intake.id}`)
          .run();
        transaction
          .update(intakeLogTable)
          .set({ intakeId })
          .where(
            sql`${intakeLogTable.intakeId} = ${intake.id} AND ${intakeLogTable.expectedIntakeAt} LIKE ${localDate} || '%'`,
          )
          .run();
      }
    } else {
      intakeId = intake.id;
      transaction
        .update(intakeTable)
        .set(values)
        .where(sql`${intakeTable.id} = ${intakeId}`)
        .run();
      transaction
        .delete(intakeMedTable)
        .where(sql`${intakeMedTable.intakeId} = ${intakeId}`)
        .run();
    }

    if (intake.medQuantities.length > 0) {
      transaction
        .insert(intakeMedTable)
        .values(intake.medQuantities.map(({ medId, quantity }) => ({ intakeId, medId, quantity })))
        .run();
    }
    return intakeId;
  });
}
