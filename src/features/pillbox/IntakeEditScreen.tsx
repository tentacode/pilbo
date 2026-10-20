import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { Button } from "@/design-system/components/Button/Button";
import { Sheet } from "@/design-system/components/Sheet/Sheet";
import { formatIntakeTime } from "@/domain/intake";

import { DeleteIntakeDialog } from "./components/DeleteIntakeDialog";
import { DiscardChangesDialog } from "./components/DiscardChangesDialog";
import { IntakeDaysField } from "./components/IntakeDaysField";
import { IntakeDraftErrorDialog } from "./components/IntakeDraftErrorDialog";
import { IntakeMedsField } from "./components/IntakeMedsField";
import { IntakeTimeRow } from "./components/IntakeTimeRow";
import { ReminderIntervalField } from "./components/ReminderIntervalField";
import { useIntakeActions } from "./hooks/useIntakeActions";
import { useIntakeDraft } from "./hooks/useIntakeDraft";
import { useModalClosing } from "./hooks/useModalClosing";
import { selectedDaysOf } from "./utils/intakeDraft";
import { type IntakeDraftError, validateIntakeDraft } from "./utils/validators";
import { styles } from "./IntakeEditScreen.styles";

export function IntakeEditScreen() {
  const intakeDraft = useIntakeDraft();
  const { draft, initialDraft } = intakeDraft;
  const modalClosing = useModalClosing(intakeDraft.isDirty);
  const intakeActions = useIntakeActions();
  const [draftError, setDraftError] = useState<IntakeDraftError | null>(null);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const savedIntakeId = initialDraft.intakeId;

  function handleSave() {
    const error = validateIntakeDraft(draft);
    if (error !== null) {
      setDraftError(error);
      return;
    }
    intakeActions.save(draft);
    modalClosing.close();
  }

  function handleDelete() {
    setIsDeleteDialogVisible(false);
    if (savedIntakeId !== undefined) {
      intakeActions.archive(savedIntakeId);
    }
    modalClosing.close();
  }

  return (
    <Sheet
      title={
        savedIntakeId === undefined
          ? "Nouvelle prise"
          : `Prise de ${formatIntakeTime(initialDraft.time)}`
      }
      leftAction={{ label: "Annuler", onPress: modalClosing.requestClose }}
      footer={<Button label="Enregistrer" icon="check" onPress={handleSave} />}
    >
      <View style={styles.content}>
        <IntakeTimeRow time={draft.time} onChange={intakeDraft.setTime} />
        <IntakeDaysField
          dayMode={draft.dayMode}
          selectedDays={selectedDaysOf(draft)}
          onDayModeChange={intakeDraft.setDayMode}
          onDayPress={intakeDraft.toggleDay}
        />
        <ReminderIntervalField
          minutes={draft.reminderIntervalMinutes}
          onChange={intakeDraft.setReminderInterval}
        />
        <IntakeMedsField
          medQuantities={draft.medQuantities}
          onEditMed={(medId) => router.push({ pathname: "/intake/med", params: { medId } })}
          onQuantityChange={intakeDraft.setQuantity}
          onRemove={intakeDraft.removeMed}
          onAddMed={() => router.push("/intake/med-picker")}
        />
        {savedIntakeId === undefined ? null : (
          <View style={styles.deleteButton}>
            <Button
              label="Supprimer cette prise"
              variant="text"
              onPress={() => setIsDeleteDialogVisible(true)}
            />
          </View>
        )}
      </View>
      <IntakeDraftErrorDialog error={draftError} onClose={() => setDraftError(null)} />
      <DeleteIntakeDialog
        isVisible={isDeleteDialogVisible}
        onDelete={handleDelete}
        onCancel={() => setIsDeleteDialogVisible(false)}
      />
      <DiscardChangesDialog
        isVisible={modalClosing.isDiscardDialogVisible}
        onDiscard={modalClosing.confirmDiscard}
        onContinue={modalClosing.cancelDiscard}
      />
    </Sheet>
  );
}
