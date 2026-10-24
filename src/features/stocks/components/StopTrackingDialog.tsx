import { Dialog } from "@/design-system/components/Dialog/Dialog";
import { useTranslation } from "react-i18next";

type StopTrackingDialogProps = {
  isVisible: boolean;
  medLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function StopTrackingDialog({
  isVisible,
  medLabel,
  onConfirm,
  onCancel,
}: StopTrackingDialogProps) {
  const { t } = useTranslation("stocks");
  return (
    <Dialog
      isVisible={isVisible}
      icon="trash"
      title={t("Ne plus suivre ce stock ?")}
      message={t("Le stock de {{med}} sera supprimé. Vous pourrez le suivre à nouveau plus tard.", {
        med: medLabel,
      })}
      confirmAction={{ label: t("Ne plus suivre"), onPress: onConfirm }}
      cancelAction={{ label: t("Annuler"), onPress: onCancel }}
      onRequestClose={onCancel}
    />
  );
}
