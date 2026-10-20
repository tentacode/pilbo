import { Dialog } from "@/design-system/components/Dialog/Dialog";

import type { IntakeDraftError } from "@/features/pillbox/utils/validators";

const ERROR_TEXTS: Record<IntakeDraftError, { title: string; message: string }> = {
  missingMed: {
    title: "Il manque un médicament",
    message: "Ajoutez au moins un médicament à la prise.",
  },
  missingDay: {
    title: "Il manque un jour",
    message: "Choisissez au moins un jour, ou « Tous les jours ».",
  },
  invalidQuantity: {
    title: "Quantité à vérifier",
    message: "Chaque quantité doit aller de 1 à 10.",
  },
};

type IntakeDraftErrorDialogProps = {
  error: IntakeDraftError | null;
  onClose: () => void;
};

export function IntakeDraftErrorDialog({ error, onClose }: IntakeDraftErrorDialogProps) {
  return (
    <Dialog
      isVisible={error !== null}
      icon="pillAlert"
      tone="warning"
      title={error === null ? "" : ERROR_TEXTS[error].title}
      message={error === null ? undefined : ERROR_TEXTS[error].message}
      confirmAction={{ label: "OK", onPress: onClose }}
      onRequestClose={onClose}
    />
  );
}
