import { useState } from "react";
import { AccessibilityInfo } from "react-native";
import { useTranslation } from "react-i18next";

import type { Intake } from "@/domain/intake";
import { formatMedLabel, type Med } from "@/domain/med";
import { database } from "@/shared/database/database";

import { archiveMed } from "@/features/meds/queries/archiveMed";
import { rescheduleAfterChange } from "@/features/pillbox/hooks/useIntakeActions";

export function useMedArchiving(med: Med, onArchived: () => void) {
  const { t } = useTranslation("meds");
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [blockingIntakes, setBlockingIntakes] = useState<Intake[]>([]);

  function confirm(): void {
    setIsConfirmDialogVisible(false);
    const result = archiveMed(database, med.id, new Date());
    if (result.status === "inIntakes") {
      setBlockingIntakes(result.intakes);
      return;
    }
    AccessibilityInfo.announceForAccessibility(t("{{med}} supprimé", { med: formatMedLabel(med) }));
    rescheduleAfterChange();
    onArchived();
  }

  return {
    isConfirmDialogVisible,
    blockingIntakes,
    request: () => setIsConfirmDialogVisible(true),
    cancel: () => setIsConfirmDialogVisible(false),
    confirm,
    closeRefusal: () => setBlockingIntakes([]),
  };
}
