import { useState } from "react";

import { SettingsRow } from "./SettingsRow";

const LABEL = "Simuler une erreur";

export function SimulateErrorRow() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error("Simulated error from the settings screen");
  }

  return (
    <SettingsRow
      label={LABEL}
      onPress={() => setShouldCrash(true)}
      accessibilityLabel={LABEL}
      accessibilityRole="button"
      accessibilityHint="Affiche l’écran d’erreur"
    />
  );
}
