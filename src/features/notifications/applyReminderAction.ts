import { fromLocalDate } from "@/domain/intakeLog";
import type { Database } from "@/shared/database/types";

import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import { getIntakesOfDay } from "@/features/today/queries/getIntakesOfDay";
import { saveIntakeValidation } from "@/features/today/queries/saveIntakeValidation";
import type { ReminderActionStatus, ReminderIntake } from "./utils/reminderActions";

export function applyReminderAction(
  database: Database,
  { intakeId, intakeDay }: ReminderIntake,
  status: ReminderActionStatus,
  now: Date,
): boolean {
  const intakeDate = fromLocalDate(intakeDay);
  const intake = getIntakesOfDay(database, intakeDate).find(({ id }) => id === intakeId);
  const isAlreadyLogged = getIntakeLogsOfDay(database, intakeDay).some(
    (intakeLog) => intakeLog.intakeId === intakeId,
  );
  if (!intake || isAlreadyLogged) {
    return false;
  }
  saveIntakeValidation(database, { intake, status, intakeDay: intakeDate, now });
  return true;
}
