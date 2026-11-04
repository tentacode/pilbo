import { type Href, router } from "expo-router";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Sheet } from "@/design-system/components/Sheet/Sheet";
import type { Med } from "@/domain/med";

import { AddMedRow } from "./components/AddMedRow";
import { FormGroup } from "./components/FormGroup";
import { FormSection } from "./components/FormSection";
import { PickerMedRow } from "./components/PickerMedRow";
import { useAllMeds } from "./hooks/useAllMeds";
import { useIntakeDraft } from "./hooks/useIntakeDraft";
import { styles } from "./MedPickerScreen.styles";

type MedPickerScreenProps = {
  newMedHref: Href;
  rowActionLabel: string;
  unavailableLabelOf: (med: Med) => string | undefined;
  onSelect: (med: Med) => void;
};

export function MedPickerScreen({
  newMedHref,
  rowActionLabel,
  unavailableLabelOf,
  onSelect,
}: MedPickerScreenProps) {
  const { t } = useTranslation("pillbox");
  const meds = useAllMeds();
  return (
    <Sheet
      title={t("Ajouter un médicament")}
      leftAction={{ label: t("Annuler"), onPress: () => router.back() }}
    >
      <View style={styles.content}>
        <FormGroup>
          <AddMedRow
            label={t("Nouveau médicament")}
            hasTopBorder={false}
            onPress={() => router.push(newMedHref)}
          />
        </FormGroup>
        {meds.length === 0 ? null : (
          <FormSection label={t("Vos médicaments")}>
            <FormGroup>
              {meds.map((med, index) => (
                <PickerMedRow
                  key={med.id}
                  med={med}
                  hasTopBorder={index > 0}
                  actionLabel={rowActionLabel}
                  unavailableLabel={unavailableLabelOf(med)}
                  onPress={() => onSelect(med)}
                />
              ))}
            </FormGroup>
          </FormSection>
        )}
      </View>
    </Sheet>
  );
}

export function IntakeMedPickerScreen() {
  const { t } = useTranslation("pillbox");
  const { draft, addMed } = useIntakeDraft();
  const medIdsInIntake = new Set(draft.medQuantities.map(({ med }) => med.id));
  return (
    <MedPickerScreen
      newMedHref="/intake/med"
      rowActionLabel={t("Ajouter")}
      unavailableLabelOf={(med) => (medIdsInIntake.has(med.id) ? t("Dans la prise") : undefined)}
      onSelect={(med) => {
        addMed(med);
        router.back();
      }}
    />
  );
}
