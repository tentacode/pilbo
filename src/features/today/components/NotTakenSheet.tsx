import { useTranslation } from "react-i18next";

import { ActionSheet } from "@/design-system/components/ActionSheet/ActionSheet";
import type { NotTakenStatus } from "@/domain/intakeLog";

type NotTakenSheetProps = {
  isVisible: boolean;
  onChoose: (status: NotTakenStatus) => void;
  onClose: () => void;
};

export function NotTakenSheet({ isVisible, onChoose, onClose }: NotTakenSheetProps) {
  const { t } = useTranslation("today");
  const { t: translateCommon } = useTranslation("common");
  return (
    <ActionSheet
      isVisible={isVisible}
      title={t("Vous ne l'avez pas pris ?")}
      message={t(
        "« Ignoré » si vous avez choisi de ne pas le prendre, par exemple sur conseil de votre médecin. « Oublié » si vous l'avez manqué : il restera noté comme non pris dans le calendrier.",
      )}
      actions={[
        { label: t("Je l'ai ignoré"), onPress: () => onChoose("skipped") },
        { label: t("Je l'ai oublié"), onPress: () => onChoose("missed") },
      ]}
      cancelLabel={translateCommon("Annuler")}
      onRequestClose={onClose}
    />
  );
}
