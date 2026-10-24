import { AccessibilityInfo } from "react-native";
import { useTranslation } from "react-i18next";

import { playSuccessHaptic } from "@/design-system/utils/playSuccessHaptic";
import { toLocalDate, toLocalDateTime } from "@/domain/intakeLog";
import { formatMedLabel, type Med } from "@/domain/med";
import { database } from "@/shared/database/database";

import { rescheduleAfterChange } from "@/features/pillbox/hooks/useIntakeActions";
import { decreaseStocks } from "@/features/stocks/queries/decreaseStocks";
import { increaseStock } from "@/features/stocks/queries/increaseStock";
import { deleteLastMedLogOfDay } from "@/features/today/queries/deleteLastMedLogOfDay";
import { insertMedLog } from "@/features/today/queries/insertMedLog";
import { formatAsNeededTakenAt, formatTakenTime } from "@/features/today/utils/formatters";
import type { AsNeededMedOfDay } from "@/features/today/utils/todayTypes";

const AS_NEEDED_QUANTITY = 1;

export function useAsNeededTaking(onChanged: () => void, onStocksBelowZero: (meds: Med[]) => void) {
  const { t } = useTranslation("today");
  return {
    take: (med: Med) => {
      const now = new Date();
      const medIdsBelowZero = database.transaction((transaction) => {
        insertMedLog(transaction, med.id, now);
        return decreaseStocks(transaction, [{ medId: med.id, quantity: AS_NEEDED_QUANTITY }]);
      });
      playSuccessHaptic();
      AccessibilityInfo.announceForAccessibility(
        `${formatMedLabel(med)}. ${formatAsNeededTakenAt(t, toLocalDateTime(now))}`,
      );
      onChanged();
      rescheduleAfterChange();
      if (medIdsBelowZero.length > 0) {
        onStocksBelowZero([med]);
      }
    },
    cancel: ({ med, lastTakenAt }: AsNeededMedOfDay) => {
      database.transaction((transaction) => {
        if (deleteLastMedLogOfDay(transaction, med.id, toLocalDate(new Date()))) {
          increaseStock(transaction, med.id, AS_NEEDED_QUANTITY);
        }
      });
      if (lastTakenAt !== undefined) {
        AccessibilityInfo.announceForAccessibility(
          t("Prise de {{med}} de {{time}} annulée", {
            med: formatMedLabel(med),
            time: formatTakenTime(lastTakenAt),
          }),
        );
      }
      onChanged();
      rescheduleAfterChange();
    },
  };
}
