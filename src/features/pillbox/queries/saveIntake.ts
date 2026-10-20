import { sql } from "drizzle-orm";

import type { Intake } from "@/domain/intake";
import { intakeMedTable, intakeTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export type IntakeToSave = Omit<Intake, "id" | "medQuantities"> & {
  id?: string;
  medQuantities: { medId: string; quantity: number }[];
};

export function saveIntake(database: Database, intake: IntakeToSave): string {
  const values = {
    hour: intake.time.hour,
    minute: intake.time.minute,
    days: intake.days,
    reminderIntervalMinutes: intake.reminderIntervalMinutes,
  };

  return database.transaction((transaction) => {
    let intakeId: string;
    if (intake.id === undefined) {
      intakeId = transaction
        .insert(intakeTable)
        .values(values)
        .returning({ id: intakeTable.id })
        .get().id;
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
