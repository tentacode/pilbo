import { AccessibilityInfo } from "react-native";

import { playSuccessHaptic } from "@/design-system/utils/playSuccessHaptic";
import { toLocalDate, toLocalDateTime } from "@/domain/intakeLog";
import { formatMedLabel, type Med } from "@/domain/med";
import { database } from "@/shared/database/database";

import { deleteMedLogsOfDay } from "@/features/today/queries/deleteMedLogsOfDay";
import { insertMedLog } from "@/features/today/queries/insertMedLog";
import { formatAsNeededTakenAt } from "@/features/today/utils/formatters";

export function useAsNeededTaking(onChanged: () => void) {
  return {
    take: (med: Med) => {
      const now = new Date();
      insertMedLog(database, med.id, now);
      playSuccessHaptic();
      AccessibilityInfo.announceForAccessibility(
        `${formatMedLabel(med)}. ${formatAsNeededTakenAt(toLocalDateTime(now))}`,
      );
      onChanged();
    },
    cancel: (med: Med) => {
      deleteMedLogsOfDay(database, med.id, toLocalDate(new Date()));
      AccessibilityInfo.announceForAccessibility(
        `Prises de ${formatMedLabel(med)} annulées pour aujourd’hui`,
      );
      onChanged();
    },
  };
}
