import { View } from "react-native";

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
  return (
    <View style={[styles.actions, isLate && styles.lateActions]}>
      <View style={styles.takeAction}>
        <Button
          label="Je l'ai pris"
          variant={isLate ? "primary" : "secondary"}
          size="large"
          icon={isLate ? "check" : undefined}
          accessibilityLabel={formatTakeAccessibilityLabel(intake)}
          isDisabled={isDisabled}
          onPress={() => onTake(intake.id)}
        />
      </View>
      <Button
        label="Ignorer"
        variant="text"
        accessibilityLabel={formatSkipAccessibilityLabel(intake)}
        isDisabled={isDisabled}
        onPress={() => onSkip(intake.id)}
      />
    </View>
  );
}
