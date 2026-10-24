import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Sheet } from "@/design-system/components/Sheet/Sheet";
import { Text } from "@/design-system/components/Text/Text";
import type { Intake } from "@/domain/intake";
import { fromLocalDate, type IntakeLog } from "@/domain/intakeLog";
import { formatFullDate, formatIntakeTime } from "@/shared/i18n/formatters";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

import { DiscardChangesDialog } from "@/features/pillbox/components/DiscardChangesDialog";
import { IntakeTimeRow } from "@/features/pillbox/components/IntakeTimeRow";
import { useModalClosing } from "@/features/pillbox/hooks/useModalClosing";
import { IntakeLogMedsField } from "./components/IntakeLogMedsField";
import { IntakeLogStatusField } from "./components/IntakeLogStatusField";
import { useIntakeLogEditing } from "./hooks/useIntakeLogEditing";
import {
  createIntakeLogDraft,
  type IntakeLogDraft,
  isIntakeLogDraftDirty,
} from "./utils/intakeLogDraft";
import { styles } from "./IntakeLogEditScreen.styles";

export function IntakeLogEditScreen() {
  const { intakeId, date } = useLocalSearchParams<{ intakeId: string; date: string }>();
  const { intake, intakeLog, save } = useIntakeLogEditing(intakeId, date);
  if (intake === undefined) {
    return null;
  }
  return <IntakeLogEditForm intake={intake} intakeLog={intakeLog} date={date} onSave={save} />;
}

type IntakeLogEditFormProps = {
  intake: Intake;
  intakeLog?: IntakeLog;
  date: string;
  onSave: (draft: IntakeLogDraft) => void;
};

function IntakeLogEditForm({ intake, intakeLog, date, onSave }: IntakeLogEditFormProps) {
  const { t } = useTranslation("today");
  const { t: translateCommon } = useTranslation("common");
  const language = useLanguage();
  const [initialDraft] = useState(() => createIntakeLogDraft(intake, intakeLog));
  const [draft, setDraft] = useState(initialDraft);
  const modalClosing = useModalClosing(isIntakeLogDraftDirty(draft, initialDraft));

  function handleSave() {
    onSave(draft);
    modalClosing.close();
  }

  return (
    <Sheet
      title={t("Prise de {{time}}", { time: formatIntakeTime(intake.time) })}
      leftAction={{ label: translateCommon("Annuler"), onPress: modalClosing.requestClose }}
      footer={<Button label={translateCommon("Enregistrer")} icon="check" onPress={handleSave} />}
    >
      <View style={styles.content}>
        <Text variant="body" tone="secondary">
          {formatFullDate(fromLocalDate(date), language)}
        </Text>
        <IntakeLogMedsField medQuantities={intake.medQuantities} />
        <IntakeLogStatusField
          status={draft.status}
          onChange={(status) => setDraft((current) => ({ ...current, status }))}
        />
        {draft.status === "taken" ? (
          <IntakeTimeRow
            time={draft.takenTime}
            onChange={(takenTime) => setDraft((current) => ({ ...current, takenTime }))}
            label={t("Heure de prise")}
            accessibilityLabel={t("Heure de prise : {{time}}", {
              time: formatIntakeTime(draft.takenTime),
            })}
          />
        ) : null}
      </View>
      <DiscardChangesDialog
        isVisible={modalClosing.isDiscardDialogVisible}
        onDiscard={modalClosing.confirmDiscard}
        onContinue={modalClosing.cancelDiscard}
      />
    </Sheet>
  );
}
