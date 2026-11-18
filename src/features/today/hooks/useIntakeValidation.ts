import { useState } from "react";
import { AccessibilityInfo } from "react-native";
import { useTranslation } from "react-i18next";

import type { Intake } from "@/domain/intake";
import type { IntakeLogStatus } from "@/domain/intakeLog";
import type { Med } from "@/domain/med";
import { playSuccessHaptic } from "@/design-system/utils/playSuccessHaptic";
import { database } from "@/shared/database/database";

import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";
import { saveIntakeValidation } from "@/features/today/queries/saveIntakeValidation";
import { formatValidationAnnouncement } from "@/features/today/utils/formatters";

type IntakeValidation = {
  validatingIntakeId: string | null;
  validate: (intakeId: string, status: IntakeLogStatus) => Promise<void>;
};

export function useIntakeValidation(
  intakes: Intake[],
  onValidated: () => void,
  onStocksBelowZero: (meds: Med[]) => void,
): IntakeValidation {
  const { t } = useTranslation("today");
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
      medsBelowZero = saveIntakeValidation(database, { intake, status, intakeDay: now, now });
    } catch (error) {
      console.error("Intake log could not be saved", error);
      setValidatingIntakeId(null);
      return;
    }
    if (status === "taken") {
      playSuccessHaptic();
    }
    AccessibilityInfo.announceForAccessibility(formatValidationAnnouncement(t, intake, status));
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
