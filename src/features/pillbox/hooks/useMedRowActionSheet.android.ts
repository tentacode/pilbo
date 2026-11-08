import { Alert } from "react-native";
import { useTranslation } from "react-i18next";

import type { MedRowActions } from "./useMedRowActionSheet";

export function useMedRowActionSheet() {
  const { t } = useTranslation("pillbox");
  // Android lays out three buttons as neutral, negative, positive: once stacked, they read top to bottom
  // as on iOS (edit, remove, cancel), and side by side, cancel stays on the left.
  return ({ medLabel, onEditMed, onRemove }: MedRowActions) =>
    Alert.alert(
      medLabel,
      undefined,
      [
        { text: t("Annuler"), style: "cancel" },
        { text: t("Retirer de la prise"), onPress: onRemove },
        { text: t("Modifier le médicament"), onPress: onEditMed },
      ],
      { cancelable: true },
    );
}
