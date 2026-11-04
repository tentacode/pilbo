import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Sheet } from "@/design-system/components/Sheet/Sheet";
import type { Med } from "@/domain/med";

import { DuplicateMedDialog } from "./components/DuplicateMedDialog";
import { MedAppearanceBlock } from "./components/MedAppearanceBlock";
import { MedFields } from "./components/MedFields";
import { useIntakeDraft } from "./hooks/useIntakeDraft";
import { useMedActions } from "./hooks/useMedActions";
import { useMedDraft } from "./hooks/useMedDraft";
import { createMedDraft, type MedDraft, type MedFlowOrigin } from "./utils/medDraft";
import { validateMedDraft } from "./utils/validators";
import { styles } from "./MedScreen.styles";

type MedScreenProps = {
  origin: MedFlowOrigin;
  onSaved: (med: Med, isNew: boolean) => void;
};

function submitLabelOf(t: TFunction<"pillbox">, origin: MedFlowOrigin, isEditing: boolean): string {
  if (isEditing) {
    return t("Enregistrer");
  }
  return origin === "intake" ? t("Ajouter à la prise") : t("Ajouter");
}

export function MedScreen({ origin, onSaved }: MedScreenProps) {
  const { t } = useTranslation("pillbox");
  const { medId } = useLocalSearchParams<{ medId?: string }>();
  const medActions = useMedActions();
  const { draft, update } = useMedDraft(() =>
    createMedDraft(medId === undefined ? undefined : medActions.getById(medId)),
  );
  const [nameError, setNameError] = useState<string>();
  const [duplicate, setDuplicate] = useState<Med | null>(null);
  const isEditing = draft.medId !== undefined;
  const isFirstScreen = isEditing || origin === "meds";

  function handleChange(changes: Partial<MedDraft>) {
    if (changes.name !== undefined) {
      setNameError(undefined);
    }
    update(changes);
  }

  function handleSave() {
    if (validateMedDraft(draft) === "missingName") {
      setNameError(t("Indiquez le nom du médicament."));
      return;
    }
    const result = medActions.save(draft);
    if (result.status === "duplicate") {
      setDuplicate(result.duplicate);
      return;
    }
    onSaved(result.med, !isEditing);
  }

  return (
    <Sheet
      title={isEditing ? t("Modifier le médicament") : t("Nouveau médicament")}
      leftAction={
        isFirstScreen
          ? { label: t("Annuler"), onPress: () => router.back() }
          : { label: t("Retour"), icon: "chevronLeft", onPress: () => router.back() }
      }
      footer={
        <Button
          label={submitLabelOf(t, origin, isEditing)}
          icon={isEditing ? "check" : "plus"}
          onPress={handleSave}
        />
      }
    >
      <View style={styles.content}>
        <MedAppearanceBlock
          design={draft.design}
          onEdit={() => router.push(origin === "intake" ? "/intake/appearance" : "/med/appearance")}
        />
        <MedFields draft={draft} nameError={nameError} onChange={handleChange} />
      </View>
      <DuplicateMedDialog duplicate={duplicate} onClose={() => setDuplicate(null)} />
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

export function MedsMedScreen() {
  return (
    <MedScreen
      origin="meds"
      onSaved={(med, isNew) => {
        router.back();
        if (isNew) {
          router.navigate({ pathname: "/meds/[medId]", params: { medId: med.id } });
        }
      }}
    />
  );
}
