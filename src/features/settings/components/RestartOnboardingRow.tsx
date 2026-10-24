import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { useTranslation } from "react-i18next";

import { SettingsRow } from "./SettingsRow";

export function RestartOnboardingRow() {
  const { t } = useTranslation("settings");
  const label = t("Revoir la présentation");
  const setOnboardingDone = useOnboardingStore((state) => state.setOnboardingDone);

  return (
    <SettingsRow
      label={label}
      hasChevron
      onPress={() => setOnboardingDone(false)}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityHint={t(
        "Affiche à nouveau la présentation de l'app, vos données sont conservées",
      )}
    />
  );
}
