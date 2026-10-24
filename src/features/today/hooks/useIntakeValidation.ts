import { useState } from "react";
import { AccessibilityInfo } from "react-native";

import { type Intake, intakeDateOn } from "@/domain/intake";
import { type IntakeLogStatus, toLocalDateTime } from "@/domain/intakeLog";
import type { Med } from "@/domain/med";
import { playSuccessHaptic } from "@/design-system/utils/playSuccessHaptic";
import { database } from "@/shared/database/database";

import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";
import { decreaseStocks } from "@/features/stocks/queries/decreaseStocks";
import { insertIntakeLog } from "@/features/today/queries/insertIntakeLog";
import { formatValidationAnnouncement } from "@/features/today/utils/formatters";

type IntakeValidation = {
  validatingIntakeId: string | null;
  validate: (intakeId: string, status: IntakeLogStatus) => Promise<void>;
};

function saveValidation(intake: Intake, status: IntakeLogStatus, now: Date): Med[] {
  const medIdsBelowZero = database.transaction((transaction) => {
    insertIntakeLog(transaction, {
      intakeId: intake.id,
      status,
      expectedIntakeAt: toLocalDateTime(intakeDateOn(now, intake.time)),
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

export function useIntakeValidation(
  intakes: Intake[],
  onValidated: () => void,
  onStocksBelowZero: (meds: Med[]) => void,
): IntakeValidation {
  const [validatingIntakeId, setValidatingIntakeId] = useState<string | null>(null);

  async function validate(intakeId: string, status: IntakeLogStatus): Promise<void> {
    const intake = intakes.find(({ id }) => id === intakeId);
    if (!intake || validatingIntakeId !== null) {
      return;
    }
    setValidatingIntakeId(intakeId);
    const now = new Date();
    let medsBelowZero: Med[];
    try {
      medsBelowZero = saveValidation(intake, status, now);
    } catch (error) {
      console.error("Intake log could not be saved", error);
      setValidatingIntakeId(null);
      return;
    }
    if (status === "taken") {
      playSuccessHaptic();
    }
    AccessibilityInfo.announceForAccessibility(formatValidationAnnouncement(intake, status));
    onValidated();
    if (medsBelowZero.length > 0) {
      onStocksBelowZero(medsBelowZero);
    }
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
