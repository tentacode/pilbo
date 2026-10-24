import { Dialog } from "@/design-system/components/Dialog/Dialog";
import { useTranslation } from "react-i18next";

type RemoveAsNeededDialogProps = {
  isVisible: boolean;
  onRemove: () => void;
  onCancel: () => void;
};

export function RemoveAsNeededDialog({ isVisible, onRemove, onCancel }: RemoveAsNeededDialogProps) {
  const { t } = useTranslation("pillbox");
  return (
    <Dialog
      isVisible={isVisible}
      icon="pillAlert"
      title={t("Enlever de « Hors planning » ?")}
      message={t("Le médicament reste dans vos prises et dans la liste de vos médicaments.")}
      confirmAction={{ label: t("Enlever"), onPress: onRemove }}
      cancelAction={{ label: t("Annuler"), onPress: onCancel }}
      onRequestClose={onCancel}
    />
  );
}
