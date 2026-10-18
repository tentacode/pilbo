import { Button } from "@/design-system/components/Button/Button";
import { clearDatabase } from "@/shared/database/clearDatabase";
import { database } from "@/shared/database/database";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

export function ClearDatabaseButton() {
  const setOnboardingDone = useOnboardingStore((state) => state.setOnboardingDone);

  const handlePress = () => {
    clearDatabase(database);
    setOnboardingDone(false);
  };

  return (
    <Button
      label="Vider la base"
      variant="secondary"
      accessibilityHint="Supprime toutes les prises et tous les médicaments"
      onPress={handlePress}
    />
  );
}
