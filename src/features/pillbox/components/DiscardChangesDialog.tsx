import { Dialog } from "@/design-system/components/Dialog/Dialog";
import { useTranslation } from "react-i18next";

type DiscardChangesDialogProps = {
  isVisible: boolean;
  onDiscard: () => void;
  onContinue: () => void;
};

export function DiscardChangesDialog({
  isVisible,
  onDiscard,
  onContinue,
}: DiscardChangesDialogProps) {
  const { t } = useTranslation("pillbox");
  return (
    <Dialog
      isVisible={isVisible}
      icon="pillAlert"
      tone="warning"
      title={t("Abandonner les modifications ?")}
      message={t("Vos changements ne seront pas enregistrés.")}
      confirmAction={{ label: t("Abandonner"), onPress: onDiscard }}
      cancelAction={{ label: t("Continuer"), onPress: onContinue }}
      onRequestClose={onContinue}
    />
  );
}
