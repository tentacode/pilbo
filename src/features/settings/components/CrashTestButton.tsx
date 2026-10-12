import { useState } from "react";

import { Button } from "@/design-system/components/Button/Button";

export function CrashTestButton() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error("Simulated error from the settings screen");
  }

  return (
    <Button
      label="Simuler une erreur"
      accessibilityHint="Affiche l’écran d’erreur"
      onPress={() => setShouldCrash(true)}
    />
  );
}
