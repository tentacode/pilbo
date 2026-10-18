import { Button } from "@/design-system/components/Button/Button";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

export function RestartOnboardingButton() {
  const setOnboardingDone = useOnboardingStore((state) => state.setOnboardingDone);

  return (
    <Button
      label="Refaire l'onboarding"
      variant="secondary"
      accessibilityHint="Affiche à nouveau la présentation de l'app, vos données sont conservées"
      onPress={() => setOnboardingDone(false)}
    />
  );
}
