import { useState } from "react";
import { AccessibilityInfo } from "react-native";
import { useTranslation } from "react-i18next";

import type { Intake } from "@/domain/intake";
import { formatMedLabel } from "@/domain/med";
import { database } from "@/shared/database/database";

import { rescheduleAfterChange } from "@/features/pillbox/hooks/useIntakeActions";
import { increaseStock } from "@/features/stocks/queries/increaseStock";
import { deleteMedLog } from "@/features/today/queries/deleteMedLog";
import { getMedLogById } from "@/features/today/queries/getMedLogById";
import { updateMedLogTime } from "@/features/today/queries/updateMedLogTime";
import { formatTakenTime } from "@/features/today/utils/formatters";
import { withTakenTime } from "@/features/today/utils/medLogTime";

const TAKEN_QUANTITY = 1;

export function useMedLogEditing(medLogId: string) {
  const { t } = useTranslation("today");
  const [medLog] = useState(() => getMedLogById(database, medLogId));

  function save(takenTime: Intake["time"]): void {
    if (medLog === undefined) {
      return;
    }
    updateMedLogTime(database, medLog.id, withTakenTime(medLog.takenAt, takenTime));
    AccessibilityInfo.announceForAccessibility(
      t("Prise de {{med}} modifiée", { med: formatMedLabel(medLog.med) }),
    );
    rescheduleAfterChange();
  }

  function remove(): void {
    if (medLog === undefined) {
      return;
    }
    database.transaction((transaction) => {
      deleteMedLog(transaction, medLog.id);
      increaseStock(transaction, medLog.med.id, TAKEN_QUANTITY);
    });
    AccessibilityInfo.announceForAccessibility(
      t("Prise de {{med}} de {{time}} supprimée", {
        med: formatMedLabel(medLog.med),
        time: formatTakenTime(medLog.takenAt),
      }),
    );
    rescheduleAfterChange();
  }

  return { medLog, save, remove };
}
