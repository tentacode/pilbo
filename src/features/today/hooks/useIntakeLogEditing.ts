import { useState } from "react";
import { AccessibilityInfo } from "react-native";
import { useTranslation } from "react-i18next";

import { sortIntakeMeds } from "@/domain/intake";
import { fromLocalDate } from "@/domain/intakeLog";
import { database } from "@/shared/database/database";
import { formatIntakeTime } from "@/shared/i18n/formatters";

import { rescheduleAfterChange } from "@/features/pillbox/hooks/useIntakeActions";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import { getIntakesOfDay } from "@/features/today/queries/getIntakesOfDay";
import { saveIntakeLogChange } from "@/features/today/queries/saveIntakeLogChange";
import type { IntakeLogDraft } from "@/features/today/utils/intakeLogDraft";

function readIntakeOfDay(intakeId: string, localDate: string) {
  const intake = getIntakesOfDay(database, fromLocalDate(localDate)).find(
    ({ id }) => id === intakeId,
  );
  return {
    intake: intake && sortIntakeMeds(intake),
    intakeLog: getIntakeLogsOfDay(database, localDate).find(
      (candidate) => candidate.intakeId === intakeId,
    ),
  };
}

export function useIntakeLogEditing(intakeId: string, localDate: string) {
  const { t } = useTranslation("today");
  const [{ intake, intakeLog }] = useState(() => readIntakeOfDay(intakeId, localDate));

  function save(draft: IntakeLogDraft): void {
    if (intake === undefined) {
      return;
    }
    try {
      saveIntakeLogChange(database, { intake, localDate, previousLog: intakeLog, ...draft });
    } catch (error) {
      console.error("Intake log could not be changed", error);
      return;
    }
    AccessibilityInfo.announceForAccessibility(
      t("Prise de {{time}} modifiée", { time: formatIntakeTime(intake.time) }),
    );
    rescheduleAfterChange();
  }

  return { intake, intakeLog, save };
}
