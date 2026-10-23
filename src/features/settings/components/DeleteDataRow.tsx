import { useState } from "react";

import { Dialog } from "@/design-system/components/Dialog/Dialog";
import { clearDatabase } from "@/shared/database/clearDatabase";
import { database } from "@/shared/database/database";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

import { SettingsRow } from "./SettingsRow";

const LABEL = "Supprimer les données";

export function DeleteDataRow() {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const setOnboardingDone = useOnboardingStore((state) => state.setOnboardingDone);

  const handleDelete = () => {
    setIsDialogVisible(false);
    clearDatabase(database);
    setOnboardingDone(false);
  };

  return (
    <>
      <SettingsRow
        label={LABEL}
        labelTone="alert"
        onPress={() => setIsDialogVisible(true)}
        accessibilityLabel={LABEL}
        accessibilityRole="button"
        accessibilityHint="Supprime toutes les prises et tous les médicaments"
      />
      <Dialog
        isVisible={isDialogVisible}
        icon="trash"
        tone="warning"
        title="Supprimer toutes les données ?"
        message="Vos prises, vos médicaments et leur historique seront effacés. Ce n'est pas réversible."
        confirmAction={{ label: "Supprimer", onPress: handleDelete }}
        cancelAction={{ label: "Annuler", onPress: () => setIsDialogVisible(false) }}
        onRequestClose={() => setIsDialogVisible(false)}
      />
    </>
  );
}
