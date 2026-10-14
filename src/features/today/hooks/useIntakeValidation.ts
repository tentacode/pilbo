import { useState } from "react";

import { type Intake, intakeDateOn } from "@/domain/intake";
import { type IntakeLogStatus, toLocalDateTime } from "@/domain/intakeLog";
import { database } from "@/shared/database/database";

import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";
import { insertIntakeLog } from "@/features/today/queries/insertIntakeLog";

type IntakeValidation = {
  validatingIntakeId: string | null;
  validate: (intakeId: string, status: IntakeLogStatus) => Promise<void>;
};

export function useIntakeValidation(intakes: Intake[], onValidated: () => void): IntakeValidation {
  const [validatingIntakeId, setValidatingIntakeId] = useState<string | null>(null);

  async function validate(intakeId: string, status: IntakeLogStatus): Promise<void> {
    const intake = intakes.find(({ id }) => id === intakeId);
    if (!intake || validatingIntakeId !== null) {
      return;
    }
    setValidatingIntakeId(intakeId);
    const now = new Date();
    try {
      insertIntakeLog(database, {
        intakeId,
        status,
        expectedIntakeAt: toLocalDateTime(intakeDateOn(now, intake.time)),
        createdAt: toLocalDateTime(now),
      });
    } catch (error) {
      console.error("Intake log could not be saved", error);
      setValidatingIntakeId(null);
      return;
    }
    onValidated();
    try {
      await rescheduleReminders(database, now);
    } catch (error) {
      console.error("Reminders could not be rescheduled", error);
    } finally {
      setValidatingIntakeId(null);
    }
  }

  return { validatingIntakeId, validate };
}
