import { Dialog } from "@/design-system/components/Dialog/Dialog";

type RemoveAsNeededDialogProps = {
  isVisible: boolean;
  onRemove: () => void;
  onCancel: () => void;
};

export function RemoveAsNeededDialog({ isVisible, onRemove, onCancel }: RemoveAsNeededDialogProps) {
  return (
    <Dialog
      isVisible={isVisible}
      icon="pillAlert"
      title="Enlever de « Hors planning » ?"
      message="Le médicament reste dans vos prises et dans la liste de vos médicaments."
      confirmAction={{ label: "Enlever", onPress: onRemove }}
      cancelAction={{ label: "Annuler", onPress: onCancel }}
      onRequestClose={onCancel}
    />
  );
}
