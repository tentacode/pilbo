import { type Intake, intakeDateOn } from "@/domain/intake";
import { type IntakeLogStatus, toLocalDateTime } from "@/domain/intakeLog";
import type { Med } from "@/domain/med";
import type { Database } from "@/shared/database/types";

import { decreaseStocks } from "@/features/stocks/queries/decreaseStocks";
import { insertIntakeLog } from "@/features/today/queries/insertIntakeLog";

type IntakeValidation = {
  intake: Intake;
  status: IntakeLogStatus;
  intakeDay: Date;
  now: Date;
};

export function saveIntakeValidation(
  database: Database,
  { intake, status, intakeDay, now }: IntakeValidation,
): Med[] {
  const medIdsBelowZero = database.transaction((transaction) => {
    insertIntakeLog(transaction, {
      intakeId: intake.id,
      status,
      expectedIntakeAt: toLocalDateTime(intakeDateOn(intakeDay, intake.time)),
      createdAt: toLocalDateTime(now),
    });
    if (status !== "taken") {
      return [];
    }
    return decreaseStocks(
      transaction,
      intake.medQuantities.map(({ med, quantity }) => ({ medId: med.id, quantity })),
    );
  });
  return intake.medQuantities
    .map(({ med }) => med)
    .filter(({ id }) => medIdsBelowZero.includes(id));
}
