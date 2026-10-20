import { Dialog } from "@/design-system/components/Dialog/Dialog";

type DeleteIntakeDialogProps = {
  isVisible: boolean;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteIntakeDialog({ isVisible, onDelete, onCancel }: DeleteIntakeDialogProps) {
  return (
    <Dialog
      isVisible={isVisible}
      icon="trash"
      title="Supprimer cette prise ?"
      message="Ses rappels s’arrêtent. L’historique de vos prises est conservé."
      confirmAction={{ label: "Supprimer", onPress: onDelete }}
      cancelAction={{ label: "Annuler", onPress: onCancel }}
      onRequestClose={onCancel}
    />
  );
}
