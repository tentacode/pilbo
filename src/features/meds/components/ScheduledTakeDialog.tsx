import { useTranslation } from "react-i18next";

import { Dialog } from "@/design-system/components/Dialog/Dialog";
import type { Intake } from "@/domain/intake";

import { formatScheduledTakeMessage } from "@/features/meds/utils/formatters";

type ScheduledTakeDialogProps = {
  isVisible: boolean;
  intakes: Intake[];
  onTake: () => void;
  onCancel: () => void;
};

export function ScheduledTakeDialog({
  isVisible,
  intakes,
  onTake,
  onCancel,
}: ScheduledTakeDialogProps) {
  const { t } = useTranslation("meds");
  return (
    <Dialog
      isVisible={isVisible}
      icon="pillAlert"
      tone="warning"
      title={t("Le prendre quand même ?")}
      message={formatScheduledTakeMessage(t, intakes)}
      confirmAction={{ label: t("Prendre quand même"), onPress: onTake }}
      cancelAction={{ label: t("Annuler"), onPress: onCancel }}
      onRequestClose={onCancel}
    />
  );
}
