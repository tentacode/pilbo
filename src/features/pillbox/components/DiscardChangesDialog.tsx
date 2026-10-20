import { Dialog } from "@/design-system/components/Dialog/Dialog";

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
  return (
    <Dialog
      isVisible={isVisible}
      icon="pillAlert"
      tone="warning"
      title="Abandonner les modifications ?"
      message="Vos changements ne seront pas enregistrés."
      confirmAction={{ label: "Abandonner", onPress: onDiscard }}
      cancelAction={{ label: "Continuer", onPress: onContinue }}
      onRequestClose={onContinue}
    />
  );
}
