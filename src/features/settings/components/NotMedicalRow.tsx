import { router } from "expo-router";

import { SettingsRow } from "./SettingsRow";

const LABEL = "Pilbo n'est pas une application médicale";

export function NotMedicalRow() {
  return (
    <SettingsRow
      label={LABEL}
      hasChevron
      onPress={() => router.push("/not-medical")}
      accessibilityLabel={LABEL}
      accessibilityRole="button"
    />
  );
}
