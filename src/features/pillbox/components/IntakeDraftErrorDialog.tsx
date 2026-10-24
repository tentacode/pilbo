import { Dialog } from "@/design-system/components/Dialog/Dialog";
import { useTranslation } from "react-i18next";

import type { IntakeDraftError } from "@/features/pillbox/utils/validators";
import type { TFunction } from "i18next";

function errorTextsOf(
  t: TFunction<"pillbox">,
): Record<IntakeDraftError, { title: string; message: string }> {
  return {
    missingMed: {
      title: t("Il manque un médicament"),
      message: t("Ajoutez au moins un médicament à la prise."),
    },
    missingDay: {
      title: t("Il manque un jour"),
      message: t("Choisissez au moins un jour, ou « Tous les jours »."),
    },
    invalidQuantity: {
      title: t("Quantité à vérifier"),
      message: t("Chaque quantité doit aller de 1 à 10."),
    },
  };
}

type IntakeDraftErrorDialogProps = {
  error: IntakeDraftError | null;
  onClose: () => void;
};

export function IntakeDraftErrorDialog({ error, onClose }: IntakeDraftErrorDialogProps) {
  const { t } = useTranslation("pillbox");
  const errorTexts = errorTextsOf(t);
  return (
    <Dialog
      isVisible={error !== null}
      icon="pillAlert"
      tone="warning"
      title={error === null ? "" : errorTexts[error].title}
      message={error === null ? undefined : errorTexts[error].message}
      confirmAction={{ label: t("OK"), onPress: onClose }}
      onRequestClose={onClose}
    />
  );
}
