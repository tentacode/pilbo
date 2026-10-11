import { Pressable, View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { colors } from "@/design-system/tokens";
import type { Intake } from "@/domain/intake";

import {
  formatIntakeAccessibilityLabel,
  formatIntakeSchedule,
  formatIntakeTime,
} from "@/features/pillbox/utils/formatters";
import { styles } from "./IntakeCard.styles";
import { IntakeMedRow } from "./IntakeMedRow";

type IntakeCardProps = {
  intake: Intake;
};

export function IntakeCard({ intake }: IntakeCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={formatIntakeAccessibilityLabel(intake)}
      style={styles.card}
    >
      <View style={styles.header}>
        <Text variant="time">{formatIntakeTime(intake.time)}</Text>
        <Icon name="chevronRight" color={colors.inkSecondary} />
      </View>
      <Text variant="small" tone="secondary" style={styles.schedule}>
        {formatIntakeSchedule(intake)}
      </Text>
      <View style={styles.meds}>
        {intake.medQuantities.map((medQuantity) => (
          <IntakeMedRow key={medQuantity.med.id} {...medQuantity} />
        ))}
      </View>
    </Pressable>
  );
}
