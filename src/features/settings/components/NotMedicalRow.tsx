import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { SettingsRow } from "./SettingsRow";

export function NotMedicalRow() {
  const { t } = useTranslation("settings");
  const label = t("Pilbo n'est pas une application médicale");
  return (
    <SettingsRow
      label={label}
      hasChevron
      onPress={() => router.push("/not-medical")}
      accessibilityLabel={label}
      accessibilityRole="button"
    />
  );
}
