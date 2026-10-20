import { ActionSheetIOS } from "react-native";

import { colors } from "@/design-system/tokens";

const EDIT_MED_INDEX = 0;
const REMOVE_MED_INDEX = 1;
const CANCEL_INDEX = 2;

type MedRowActions = {
  medLabel: string;
  onEditMed: () => void;
  onRemove: () => void;
};

export function useMedRowActionSheet() {
  return ({ medLabel, onEditMed, onRemove }: MedRowActions) =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: medLabel,
        options: ["Modifier le médicament", "Retirer de la prise", "Annuler"],
        cancelButtonIndex: CANCEL_INDEX,
        tintColor: colors.ink,
        userInterfaceStyle: "light",
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
