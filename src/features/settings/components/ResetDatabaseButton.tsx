import { Button } from "@/design-system/components/Button/Button";
import { database } from "@/shared/database/database";
import { resetDatabase } from "@/shared/database/resetDatabase";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

export function ResetDatabaseButton() {
  const setOnboardingDone = useOnboardingStore((state) => state.setOnboardingDone);

  const handlePress = () => {
    resetDatabase(database, { withLogs: __DEV__ });
    setOnboardingDone(true);
  };

  return (
    <Button
      label="Réinitialiser la base"
      variant="secondary"
      accessibilityHint="Remplace les données par les données de test"
      onPress={handlePress}
    />
  );
}
