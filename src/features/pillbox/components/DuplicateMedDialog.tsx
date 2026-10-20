import { Dialog } from "@/design-system/components/Dialog/Dialog";
import { formatMedLabel, type Med } from "@/domain/med";

type DuplicateMedDialogProps = {
  duplicate: Med | null;
  onClose: () => void;
};

export function DuplicateMedDialog({ duplicate, onClose }: DuplicateMedDialogProps) {
  return (
    <Dialog
      isVisible={duplicate !== null}
      icon="pillAlert"
      tone="warning"
      title={duplicate === null ? "" : `Votre médicament ${formatMedLabel(duplicate)} existe déjà`}
      message="Essayez un autre nom ou un autre dosage."
      confirmAction={{ label: "OK", onPress: onClose }}
      onRequestClose={onClose}
    />
  );
}
