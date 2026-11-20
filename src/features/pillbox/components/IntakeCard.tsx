import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";
import { type Intake } from "@/domain/intake";

import {
  formatIntakeAccessibilityLabel,
  formatIntakeSchedule,
} from "@/features/pillbox/utils/formatters";
import { formatNextIntake } from "@/features/pillbox/utils/recurrenceFormatters";
import { pillStackLayoutOf } from "@/features/pillbox/utils/pillStack";
import { useStyles } from "./IntakeCard.styles";
import { IntakeMedRow } from "./IntakeMedRow";
import { formatIntakeTime } from "@/shared/i18n/formatters";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type IntakeCardProps = {
  intake: Intake;
  nextIntakeDate: Date | null;
  now: Date;
  onPress: () => void;
};

export function IntakeCard({ intake, nextIntakeDate, now, onPress }: IntakeCardProps) {
  const styles = useStyles();
  const themeColors = useThemeColors();
  const { t } = useTranslation("pillbox");
  const language = useLanguage();
  const pillStackLayout = pillStackLayoutOf(intake.medQuantities);
  const nextIntake =
    nextIntakeDate === null ? null : formatNextIntake(t, language, nextIntakeDate, now);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={formatIntakeAccessibilityLabel(t, language, intake, nextIntake)}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text variant="time">{formatIntakeTime(intake.time)}</Text>
        <Icon name="chevronRight" color={themeColors.inkSecondary} />
      </View>
      <Text variant="small" tone="secondary" style={styles.schedule}>
        {formatIntakeSchedule(t, language, intake)}
      </Text>
      {nextIntake === null ? null : (
        <Text variant="small" tone="secondary">
          {nextIntake}
        </Text>
      )}
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
