import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { colors } from "@/design-system/tokens";
import { type Intake } from "@/domain/intake";

import {
  formatIntakeAccessibilityLabel,
  formatIntakeSchedule,
} from "@/features/pillbox/utils/formatters";
import { pillStackLayoutOf } from "@/features/pillbox/utils/pillStack";
import { styles } from "./IntakeCard.styles";
import { IntakeMedRow } from "./IntakeMedRow";
import { formatIntakeTime } from "@/shared/i18n/formatters";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type IntakeCardProps = {
  intake: Intake;
  onPress: () => void;
};

export function IntakeCard({ intake, onPress }: IntakeCardProps) {
  const { t } = useTranslation("pillbox");
  const language = useLanguage();
  const pillStackLayout = pillStackLayoutOf(intake.medQuantities);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={formatIntakeAccessibilityLabel(t, language, intake)}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text variant="time">{formatIntakeTime(intake.time)}</Text>
        <Icon name="chevronRight" color={colors.inkSecondary} />
      </View>
      <Text variant="small" tone="secondary" style={styles.schedule}>
        {formatIntakeSchedule(t, language, intake)}
      </Text>
      <View style={styles.meds}>
        {intake.medQuantities.map((medQuantity) => (
          <IntakeMedRow
            key={medQuantity.med.id}
            {...medQuantity}
            pillStackLayout={pillStackLayout}
          />
        ))}
      </View>
    </Pressable>
  );
}
