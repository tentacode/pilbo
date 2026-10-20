import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { Button } from "@/design-system/components/Button/Button";
import { Sheet } from "@/design-system/components/Sheet/Sheet";
import type { Med } from "@/domain/med";

import { DuplicateMedDialog } from "./components/DuplicateMedDialog";
import { MedAppearanceBlock } from "./components/MedAppearanceBlock";
import { MedFields } from "./components/MedFields";
import { RemoveAsNeededDialog } from "./components/RemoveAsNeededDialog";
import { useIntakeDraft } from "./hooks/useIntakeDraft";
import { useMedActions } from "./hooks/useMedActions";
import { useMedDraft } from "./hooks/useMedDraft";
import { createMedDraft, type MedDraft, type MedFlowOrigin } from "./utils/medDraft";
import { validateMedDraft } from "./utils/validators";
import { styles } from "./MedScreen.styles";

const MISSING_NAME_ERROR = "Indiquez le nom du médicament.";

type MedScreenProps = {
  origin: MedFlowOrigin;
  onSaved: (med: Med, isNew: boolean) => void;
  onRemovedFromAsNeeded?: () => void;
};

function submitLabelOf(origin: MedFlowOrigin, isEditing: boolean): string {
  if (isEditing) {
    return "Enregistrer";
  }
  return origin === "intake" ? "Ajouter à la prise" : "Ajouter au hors planning";
}

export function MedScreen({ origin, onSaved, onRemovedFromAsNeeded }: MedScreenProps) {
  const { medId } = useLocalSearchParams<{ medId?: string }>();
  const medActions = useMedActions();
  const { draft, update } = useMedDraft(() =>
    createMedDraft(origin, medId === undefined ? undefined : medActions.getById(medId)),
  );
  const [nameError, setNameError] = useState<string>();
  const [duplicate, setDuplicate] = useState<Med | null>(null);
  const [isRemoveDialogVisible, setIsRemoveDialogVisible] = useState(false);
  const isEditing = draft.medId !== undefined;
  const editingMedId = draft.medId;

  function handleChange(changes: Partial<MedDraft>) {
    if (changes.name !== undefined) {
      setNameError(undefined);
    }
    update(changes);
  }

  function handleSave() {
    if (validateMedDraft(draft) === "missingName") {
      setNameError(MISSING_NAME_ERROR);
      return;
    }
    const result = medActions.save(draft, origin === "asNeeded");
    if (result.status === "duplicate") {
      setDuplicate(result.duplicate);
      return;
    }
    onSaved(result.med, !isEditing);
  }

  function handleRemoveFromAsNeeded() {
    setIsRemoveDialogVisible(false);
    if (editingMedId !== undefined) {
      medActions.setAsNeeded(editingMedId, false);
    }
    onRemovedFromAsNeeded?.();
  }

  return (
    <Sheet
      title={isEditing ? "Modifier le médicament" : "Nouveau médicament"}
      leftAction={
        isEditing
          ? { label: "Annuler", onPress: () => router.back() }
          : { label: "Retour", icon: "chevronLeft", onPress: () => router.back() }
      }
      footer={
        <Button
          label={submitLabelOf(origin, isEditing)}
          icon={isEditing ? "check" : "plus"}
          onPress={handleSave}
        />
      }
    >
      <View style={styles.content}>
        <MedAppearanceBlock
          design={draft.design}
          onEdit={() =>
            router.push(origin === "intake" ? "/intake/appearance" : "/as-needed/appearance")
          }
        />
        <MedFields draft={draft} nameError={nameError} onChange={handleChange} />
        {origin === "asNeeded" && isEditing ? (
          <View style={styles.removeButton}>
            <Button
              label="Enlever de « Hors planning »"
              variant="text"
              onPress={() => setIsRemoveDialogVisible(true)}
            />
          </View>
        ) : null}
      </View>
      <DuplicateMedDialog duplicate={duplicate} onClose={() => setDuplicate(null)} />
      <RemoveAsNeededDialog
        isVisible={isRemoveDialogVisible}
        onRemove={handleRemoveFromAsNeeded}
        onCancel={() => setIsRemoveDialogVisible(false)}
      />
    </Sheet>
  );
}

export function IntakeMedScreen() {
  const intakeDraft = useIntakeDraft();
  return (
    <MedScreen
      origin="intake"
      onSaved={(med, isNew) => {
        if (isNew) {
          intakeDraft.addMed(med);
          router.dismissAll();
        } else {
          intakeDraft.updateMed(med);
          router.back();
        }
      }}
    />
  );
}

export function AsNeededMedScreen() {
  const navigation = useNavigation();
  const closeModal = () => navigation.getParent()?.goBack();
  return <MedScreen origin="asNeeded" onSaved={closeModal} onRemovedFromAsNeeded={closeModal} />;
}
