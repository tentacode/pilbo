import { Dialog } from "@/design-system/components/Dialog/Dialog";
import { useTranslation } from "react-i18next";

type ApplySoundDialogProps = {
  isVisible: boolean;
  onApplyToAllIntakes: () => void;
  onKeepForNewIntakes: () => void;
};

export function ApplySoundDialog({
  isVisible,
  onApplyToAllIntakes,
  onKeepForNewIntakes,
}: ApplySoundDialogProps) {
  const { t } = useTranslation("settings");
  return (
    <Dialog
      isVisible={isVisible}
      title={t("Appliquer à toutes les prises ?")}
      message={t("Certaines de vos prises ont un autre son.")}
      confirmAction={{ label: t("Toutes les prises"), onPress: onApplyToAllIntakes }}
      cancelAction={{ label: t("Nouvelles prises uniquement"), onPress: onKeepForNewIntakes }}
      onRequestClose={onKeepForNewIntakes}
    />
  );
}
