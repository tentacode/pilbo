import { Dialog } from "@/design-system/components/Dialog/Dialog";
import { formatMedLabel, type Med } from "@/domain/med";
import { useTranslation } from "react-i18next";

type DuplicateMedDialogProps = {
  duplicate: Med | null;
  onClose: () => void;
};

export function DuplicateMedDialog({ duplicate, onClose }: DuplicateMedDialogProps) {
  const { t } = useTranslation("pillbox");
  return (
    <Dialog
      isVisible={duplicate !== null}
      icon="pillAlert"
      tone="warning"
      title={
        duplicate === null
          ? ""
          : t("Votre médicament {{med}} existe déjà", { med: formatMedLabel(duplicate) })
      }
      message={t("Essayez un autre nom ou un autre dosage.")}
      confirmAction={{ label: t("OK"), onPress: onClose }}
      onRequestClose={onClose}
    />
  );
}
