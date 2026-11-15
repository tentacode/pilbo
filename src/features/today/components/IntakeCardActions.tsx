import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import type { Intake } from "@/domain/intake";
import type { NotTakenStatus } from "@/domain/intakeLog";

import {
  formatNotTakenAccessibilityLabel,
  formatTakeAccessibilityLabel,
} from "@/features/today/utils/formatters";
import { useStyles } from "./IntakeCardActions.styles";
import { NotTakenSheet } from "./NotTakenSheet";

type IntakeCardActionsProps = {
  intake: Intake;
  isLate?: boolean;
  isDisabled?: boolean;
  onTake: (intakeId: string) => void;
  onNotTaken: (intakeId: string, status: NotTakenStatus) => void;
};

export function IntakeCardActions({
  intake,
  isLate = false,
  isDisabled = false,
  onTake,
  onNotTaken,
}: IntakeCardActionsProps) {
  const styles = useStyles();
  const { t } = useTranslation("today");
  const [isNotTakenSheetVisible, setIsNotTakenSheetVisible] = useState(false);

  function chooseNotTakenStatus(status: NotTakenStatus) {
    setIsNotTakenSheetVisible(false);
    onNotTaken(intake.id, status);
  }

  return (
    <View style={[styles.actions, isLate && styles.lateActions]}>
      <View style={styles.takeAction}>
        <Button
          label={t("Je l'ai pris")}
          variant={isLate ? "prominent" : "secondary"}
          size="large"
          icon={isLate ? "check" : undefined}
          accessibilityLabel={formatTakeAccessibilityLabel(t, intake)}
          isDisabled={isDisabled}
          onPress={() => onTake(intake.id)}
        />
      </View>
      <Button
        label={t("Pas pris…")}
        variant="text"
        accessibilityLabel={formatNotTakenAccessibilityLabel(t, intake)}
        accessibilityHint={t("Propose de l'ignorer ou de le marquer oublié.")}
        isDisabled={isDisabled}
        onPress={() => setIsNotTakenSheetVisible(true)}
      />
      <NotTakenSheet
        isVisible={isNotTakenSheetVisible}
        onChoose={chooseNotTakenStatus}
        onClose={() => setIsNotTakenSheetVisible(false)}
      />
    </View>
  );
}
