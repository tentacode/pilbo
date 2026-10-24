import { useState } from "react";
import { useTranslation } from "react-i18next";

import { SettingsRow } from "./SettingsRow";

export function SimulateErrorRow() {
  const { t } = useTranslation("settings");
  const label = t("Simuler une erreur");
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error("Simulated error from the settings screen");
  }

  return (
    <SettingsRow
      label={label}
      onPress={() => setShouldCrash(true)}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityHint={t("Affiche l’écran d’erreur")}
    />
  );
}
