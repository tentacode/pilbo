import { type Href, router } from "expo-router";
import type { ReactNode } from "react";
import { View } from "react-native";

import { Sheet } from "@/design-system/components/Sheet/Sheet";
import type { Med } from "@/domain/med";

import { AddMedRow } from "./components/AddMedRow";
import { FormGroup } from "./components/FormGroup";
import { FormSection } from "./components/FormSection";
import { PickerMedRow } from "./components/PickerMedRow";
import { useAllMeds } from "./hooks/useAllMeds";
import { useIntakeDraft } from "./hooks/useIntakeDraft";
import { useMedActions } from "./hooks/useMedActions";
import { styles } from "./MedPickerScreen.styles";

type MedPickerScreenProps = {
  title?: string;
  newMedHref?: Href;
  rowActionLabel?: string;
  unavailableLabelOf?: (med: Med) => string | undefined;
  statusLabelOf?: (med: Med) => string | undefined;
  emptyContent?: ReactNode;
  onSelect: (med: Med) => void;
};

export function MedPickerScreen({
  title = "Ajouter un médicament",
  newMedHref,
  rowActionLabel,
  unavailableLabelOf,
  statusLabelOf,
  emptyContent,
  onSelect,
}: MedPickerScreenProps) {
  const meds = useAllMeds();
  return (
    <Sheet title={title} leftAction={{ label: "Annuler", onPress: () => router.back() }}>
      <View style={styles.content}>
        {newMedHref === undefined ? null : (
          <FormGroup>
            <AddMedRow
              label="Nouveau médicament"
              hasTopBorder={false}
              onPress={() => router.push(newMedHref)}
            />
          </FormGroup>
        )}
        {meds.length === 0 ? (
          emptyContent
        ) : (
          <FormSection label="Vos médicaments">
            <FormGroup>
              {meds.map((med, index) => (
                <PickerMedRow
                  key={med.id}
                  med={med}
                  hasTopBorder={index > 0}
                  actionLabel={rowActionLabel}
                  unavailableLabel={unavailableLabelOf?.(med)}
                  statusLabel={statusLabelOf?.(med)}
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
  const { draft, addMed } = useIntakeDraft();
  const medIdsInIntake = new Set(draft.medQuantities.map(({ med }) => med.id));
  return (
    <MedPickerScreen
      newMedHref="/intake/med"
      rowActionLabel="Ajouter"
      unavailableLabelOf={(med) => (medIdsInIntake.has(med.id) ? "Dans la prise" : undefined)}
      onSelect={(med) => {
        addMed(med);
        router.back();
      }}
    />
  );
}

export function AsNeededMedPickerScreen() {
  const medActions = useMedActions();
  return (
    <MedPickerScreen
      newMedHref="/as-needed/med"
      rowActionLabel="Ajouter"
      unavailableLabelOf={(med) => (med.isAsNeeded ? "Déjà hors planning" : undefined)}
      onSelect={(med) => {
        medActions.setAsNeeded(med.id, true);
        router.back();
      }}
    />
  );
}
