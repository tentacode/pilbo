import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Dialog } from "@/design-system/components/Dialog/Dialog";
import { database } from "@/shared/database/database";
import { resetDatabase } from "@/shared/database/resetDatabase";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

import { SettingsRow } from "./SettingsRow";

export function ResetWithTestDataRow() {
  const { t } = useTranslation("settings");
  const label = t("Réinitialiser avec des données de test");
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
        label={label}
        onPress={() => setIsDialogVisible(true)}
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityHint={t("Remplace les données par les données de test")}
      />
      <Dialog
        isVisible={isDialogVisible}
        icon="alert"
        tone="warning"
        title={t("Remplacer vos données ?")}
        message={t(
          "Vos prises, vos médicaments et leur historique seront remplacés par des données de test.",
        )}
        confirmAction={{ label: t("Réinitialiser"), onPress: handleReset }}
        cancelAction={{ label: t("Annuler"), onPress: () => setIsDialogVisible(false) }}
        onRequestClose={() => setIsDialogVisible(false)}
      />
    </>
  );
}
