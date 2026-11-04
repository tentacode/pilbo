import { useState } from "react";
import { AccessibilityInfo } from "react-native";
import { useTranslation } from "react-i18next";

import { toLocalDateTime } from "@/domain/intakeLog";
import type { Med } from "@/domain/med";
import { playSuccessHaptic } from "@/design-system/utils/playSuccessHaptic";
import { database } from "@/shared/database/database";

import {
  formatTakenAnnouncement,
  formatUndoneAnnouncement,
} from "@/features/meds/utils/formatters";
import { rescheduleAfterChange } from "@/features/pillbox/hooks/useIntakeActions";
import { decreaseStocks } from "@/features/stocks/queries/decreaseStocks";
import { increaseStock } from "@/features/stocks/queries/increaseStock";
import { deleteMedLog } from "@/features/today/queries/deleteMedLog";
import { getMedLogById } from "@/features/today/queries/getMedLogById";
import { insertMedLog } from "@/features/today/queries/insertMedLog";

const TAKEN_QUANTITY = 1;

type TakenMedLog = {
  id: string;
  takenAt: string;
};

function saveTaking(med: Med, now: Date): { medLogId: string; isBelowZero: boolean } {
  return database.transaction((transaction) => {
    const medLogId = insertMedLog(transaction, med.id, now);
    const medIdsBelowZero = decreaseStocks(transaction, [
      { medId: med.id, quantity: TAKEN_QUANTITY },
    ]);
    return { medLogId, isBelowZero: medIdsBelowZero.length > 0 };
  });
}

function cancelTaking(med: Med, medLogId: string): void {
  database.transaction((transaction) => {
    if (getMedLogById(transaction, medLogId) === undefined) {
      return;
    }
    deleteMedLog(transaction, medLogId);
    increaseStock(transaction, med.id, TAKEN_QUANTITY);
  });
}

export function useMedTaking(med: Med, onChanged: () => void, onStockBelowZero: () => void) {
  const { t } = useTranslation("meds");
  const [takenMedLogs, setTakenMedLogs] = useState<TakenMedLog[]>([]);
  const lastTakenMedLog = takenMedLogs.at(-1);

  function take(): void {
    const now = new Date();
    const takenAt = toLocalDateTime(now);
    const { medLogId, isBelowZero } = saveTaking(med, now);
    setTakenMedLogs((current) => [...current, { id: medLogId, takenAt }]);
    playSuccessHaptic();
    AccessibilityInfo.announceForAccessibility(formatTakenAnnouncement(t, med, takenAt));
    onChanged();
    rescheduleAfterChange();
    if (isBelowZero) {
      onStockBelowZero();
    }
  }

  function undo(): void {
    if (lastTakenMedLog === undefined) {
      return;
    }
    cancelTaking(med, lastTakenMedLog.id);
    setTakenMedLogs((current) => current.slice(0, -1));
    AccessibilityInfo.announceForAccessibility(
      formatUndoneAnnouncement(t, med, lastTakenMedLog.takenAt),
    );
    onChanged();
    rescheduleAfterChange();
  }

  return { take, undo, lastTakenMedLog };
}
