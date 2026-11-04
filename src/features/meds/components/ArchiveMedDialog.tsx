import { useTranslation } from "react-i18next";

import { Dialog } from "@/design-system/components/Dialog/Dialog";

type ArchiveMedDialogProps = {
  isVisible: boolean;
  onArchive: () => void;
  onCancel: () => void;
};

export function ArchiveMedDialog({ isVisible, onArchive, onCancel }: ArchiveMedDialogProps) {
  const { t } = useTranslation("meds");
  return (
    <Dialog
      isVisible={isVisible}
      icon="trash"
      title={t("Supprimer ce médicament ?")}
      message={t("Son stock est supprimé. L’historique de vos prises est conservé.")}
      confirmAction={{ label: t("Supprimer"), onPress: onArchive }}
      cancelAction={{ label: t("Annuler"), onPress: onCancel }}
      onRequestClose={onCancel}
    />
  );
}
