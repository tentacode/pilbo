import { useState } from "react";

import { Dialog } from "@/design-system/components/Dialog/Dialog";
import { database } from "@/shared/database/database";
import { resetDatabase } from "@/shared/database/resetDatabase";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

import { SettingsRow } from "./SettingsRow";

const LABEL = "Réinitialiser avec des données de test";

export function ResetWithTestDataRow() {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const setOnboardingDone = useOnboardingStore((state) => state.setOnboardingDone);

  const handleReset = () => {
    setIsDialogVisible(false);
    resetDatabase(database, { withLogs: __DEV__ });
    setOnboardingDone(true);
  };

  return (
    <>
      <SettingsRow
        label={LABEL}
        onPress={() => setIsDialogVisible(true)}
        accessibilityLabel={LABEL}
        accessibilityRole="button"
        accessibilityHint="Remplace les données par les données de test"
      />
      <Dialog
        isVisible={isDialogVisible}
        icon="alert"
        tone="warning"
        title="Remplacer vos données ?"
        message="Vos prises, vos médicaments et leur historique seront remplacés par des données de test."
        confirmAction={{ label: "Réinitialiser", onPress: handleReset }}
        cancelAction={{ label: "Annuler", onPress: () => setIsDialogVisible(false) }}
        onRequestClose={() => setIsDialogVisible(false)}
      />
    </>
  );
}
