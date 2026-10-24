import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Dialog } from "@/design-system/components/Dialog/Dialog";
import { clearDatabase } from "@/shared/database/clearDatabase";
import { database } from "@/shared/database/database";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

import { SettingsRow } from "./SettingsRow";

export function DeleteDataRow() {
  const { t } = useTranslation("settings");
  const label = t("Supprimer les données");
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
        label={label}
        labelTone="alert"
        onPress={() => setIsDialogVisible(true)}
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityHint={t("Supprime toutes les prises et tous les médicaments")}
      />
      <Dialog
        isVisible={isDialogVisible}
        icon="trash"
        tone="warning"
        title={t("Supprimer toutes les données ?")}
        message={t(
          "Vos prises, vos médicaments et leur historique seront effacés. Ce n'est pas réversible.",
        )}
        confirmAction={{ label: t("Supprimer"), onPress: handleDelete }}
        cancelAction={{ label: t("Annuler"), onPress: () => setIsDialogVisible(false) }}
        onRequestClose={() => setIsDialogVisible(false)}
      />
    </>
  );
}
