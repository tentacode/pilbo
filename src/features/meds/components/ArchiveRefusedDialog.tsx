import { useTranslation } from "react-i18next";

import { Dialog } from "@/design-system/components/Dialog/Dialog";
import type { Intake } from "@/domain/intake";

import { formatArchiveRefusedMessage } from "@/features/meds/utils/formatters";

type ArchiveRefusedDialogProps = {
  intakes: Intake[];
  onClose: () => void;
};

export function ArchiveRefusedDialog({ intakes, onClose }: ArchiveRefusedDialogProps) {
  const { t } = useTranslation("meds");
  return (
    <Dialog
      isVisible={intakes.length > 0}
      icon="pillAlert"
      tone="warning"
      title={t("Ce médicament est encore prévu")}
      message={formatArchiveRefusedMessage(t, intakes)}
      confirmAction={{ label: t("OK"), onPress: onClose }}
      onRequestClose={onClose}
    />
  );
}
