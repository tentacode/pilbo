import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import type { Intake } from "@/domain/intake";

import {
  formatSkipAccessibilityLabel,
  formatTakeAccessibilityLabel,
} from "@/features/today/utils/formatters";
import { styles } from "./IntakeCardActions.styles";

type IntakeCardActionsProps = {
  intake: Intake;
  isLate?: boolean;
  isDisabled?: boolean;
  onTake: (intakeId: string) => void;
  onSkip: (intakeId: string) => void;
};

export function IntakeCardActions({
  intake,
  isLate = false,
  isDisabled = false,
  onTake,
  onSkip,
}: IntakeCardActionsProps) {
  const { t } = useTranslation("today");
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
        label={t("Ignorer")}
        variant="text"
        accessibilityLabel={formatSkipAccessibilityLabel(t, intake)}
        isDisabled={isDisabled}
        onPress={() => onSkip(intake.id)}
      />
    </View>
  );
}
