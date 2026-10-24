import { ActionSheetIOS } from "react-native";
import { useTranslation } from "react-i18next";

import { useThemeColors } from "@/design-system/hooks/useThemeColors";

const EDIT_MED_INDEX = 0;
const REMOVE_MED_INDEX = 1;
const CANCEL_INDEX = 2;

type MedRowActions = {
  medLabel: string;
  onEditMed: () => void;
  onRemove: () => void;
};

export function useMedRowActionSheet() {
  const { t } = useTranslation("pillbox");
  const themeColors = useThemeColors();
  return ({ medLabel, onEditMed, onRemove }: MedRowActions) =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: medLabel,
        options: [t("Modifier le médicament"), t("Retirer de la prise"), t("Annuler")],
        cancelButtonIndex: CANCEL_INDEX,
        tintColor: themeColors.ink,
      },
      (buttonIndex) => {
        if (buttonIndex === EDIT_MED_INDEX) {
          onEditMed();
        } else if (buttonIndex === REMOVE_MED_INDEX) {
          onRemove();
        }
      },
    );
}
