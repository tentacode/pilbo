import { Dialog } from "@/design-system/components/Dialog/Dialog";

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
  return (
    <Dialog
      isVisible={isVisible}
      icon="trash"
      title="Ne plus suivre ce stock ?"
      message={`Le stock de ${medLabel} sera supprimé. Vous pourrez le suivre à nouveau plus tard.`}
      confirmAction={{ label: "Ne plus suivre", onPress: onConfirm }}
      cancelAction={{ label: "Annuler", onPress: onCancel }}
      onRequestClose={onCancel}
    />
  );
}
