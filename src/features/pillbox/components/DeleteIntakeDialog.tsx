import { Dialog } from "@/design-system/components/Dialog/Dialog";
import { useTranslation } from "react-i18next";

type DeleteIntakeDialogProps = {
  isVisible: boolean;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteIntakeDialog({ isVisible, onDelete, onCancel }: DeleteIntakeDialogProps) {
  const { t } = useTranslation("pillbox");
  return (
    <Dialog
      isVisible={isVisible}
      icon="trash"
      title={t("Supprimer cette prise ?")}
      message={t("Ses rappels s’arrêtent. L’historique de vos prises est conservé.")}
      confirmAction={{ label: t("Supprimer"), onPress: onDelete }}
      cancelAction={{ label: t("Annuler"), onPress: onCancel }}
      onRequestClose={onCancel}
    />
  );
}
