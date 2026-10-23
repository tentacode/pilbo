import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

import { SettingsRow } from "./SettingsRow";

const LABEL = "Revoir la présentation";

export function RestartOnboardingRow() {
  const setOnboardingDone = useOnboardingStore((state) => state.setOnboardingDone);

  return (
    <SettingsRow
      label={LABEL}
      hasChevron
      onPress={() => setOnboardingDone(false)}
      accessibilityLabel={LABEL}
      accessibilityRole="button"
      accessibilityHint="Affiche à nouveau la présentation de l'app, vos données sont conservées"
    />
  );
}
