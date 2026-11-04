import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Sheet } from "@/design-system/components/Sheet/Sheet";
import type { Intake } from "@/domain/intake";
import { fromLocalDateTime } from "@/domain/intakeLog";
import { formatFullDate, formatIntakeTime } from "@/shared/i18n/formatters";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

import { DiscardChangesDialog } from "@/features/pillbox/components/DiscardChangesDialog";
import { IntakeTimeRow } from "@/features/pillbox/components/IntakeTimeRow";
import { useModalClosing } from "@/features/pillbox/hooks/useModalClosing";
import { StockEditHeader } from "@/features/stocks/components/StockEditHeader";
import { useMedLogEditing } from "./hooks/useMedLogEditing";
import { isSameTime, takenTimeOf } from "./utils/medLogTime";
import type { MedLogOfDay } from "./utils/todayTypes";
import { styles } from "./MedLogEditScreen.styles";

export function MedLogEditScreen() {
  const { medLogId } = useLocalSearchParams<{ medLogId: string }>();
  const { medLog, save, remove } = useMedLogEditing(medLogId);
  if (medLog === undefined) {
    return null;
  }
  return <MedLogEditForm medLog={medLog} onSave={save} onRemove={remove} />;
}

type MedLogEditFormProps = {
  medLog: MedLogOfDay;
  onSave: (takenTime: Intake["time"]) => void;
  onRemove: () => void;
};

function MedLogEditForm({ medLog, onSave, onRemove }: MedLogEditFormProps) {
  const { t } = useTranslation("today");
  const { t: translateCommon } = useTranslation("common");
  const language = useLanguage();
  const [initialTime] = useState(() => takenTimeOf(medLog.takenAt));
  const [takenTime, setTakenTime] = useState(initialTime);
  const modalClosing = useModalClosing(!isSameTime(takenTime, initialTime));

  function handleSave() {
    onSave(takenTime);
    modalClosing.close();
  }

  function handleRemove() {
    onRemove();
    modalClosing.close();
  }

  return (
    <Sheet
      title={t("Prise de {{time}}", { time: formatIntakeTime(initialTime) })}
      leftAction={{ label: translateCommon("Annuler"), onPress: modalClosing.requestClose }}
      footer={<Button label={translateCommon("Enregistrer")} icon="check" onPress={handleSave} />}
    >
      <View style={styles.content}>
        <StockEditHeader
          med={medLog.med}
          subtitle={formatFullDate(fromLocalDateTime(medLog.takenAt), language)}
        />
        <IntakeTimeRow
          time={takenTime}
          onChange={setTakenTime}
          label={t("Heure de prise")}
          accessibilityLabel={t("Heure de prise : {{time}}", {
            time: formatIntakeTime(takenTime),
          })}
        />
        <View style={styles.deleteButton}>
          <Button label={t("Supprimer cette prise")} variant="text" onPress={handleRemove} />
        </View>
      </View>
      <DiscardChangesDialog
        isVisible={modalClosing.isDiscardDialogVisible}
        onDiscard={modalClosing.confirmDiscard}
        onContinue={modalClosing.cancelDiscard}
      />
    </Sheet>
  );
}
