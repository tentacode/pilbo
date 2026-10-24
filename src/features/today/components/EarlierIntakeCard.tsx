import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { sizes } from "@/design-system/tokens";

import {
  formatEarlierIntakeAccessibilityLabel,
  formatMedNames,
} from "@/features/today/utils/formatters";
import type { TodayIntake } from "@/features/today/utils/todayTypes";
import { styles } from "./EarlierIntakeCard.styles";
import { IntakeStatusLabel } from "./IntakeStatusLabel";
import { formatIntakeTime } from "@/shared/i18n/formatters";

type EarlierIntakeCardProps = {
  todayIntake: TodayIntake;
};

export function EarlierIntakeCard({ todayIntake }: EarlierIntakeCardProps) {
  const { t } = useTranslation("today");
  const { intake, status } = todayIntake;

  return (
    <View
      accessible
      accessibilityLabel={formatEarlierIntakeAccessibilityLabel(t, todayIntake)}
      style={[styles.card, status === "skipped" ? styles.skippedCard : styles.takenCard]}
    >
      <View style={styles.head}>
        <View style={styles.heading}>
          <Text variant="compactTime" tone="secondary" style={styles.time}>
            {formatIntakeTime(intake.time)}
          </Text>
          <IntakeStatusLabel todayIntake={todayIntake} />
        </View>
        <View style={styles.strip}>
          {intake.medQuantities.map(({ med }, index) => (
            <View key={med.id} style={index > 0 && styles.stripPill}>
              <Pill design={med.design} displaySize={sizes.pillInStrip} />
            </View>
          ))}
        </View>
      </View>
      <Text variant="small" tone="secondary" style={styles.names}>
        {formatMedNames(intake.medQuantities)}
      </Text>
    </View>
  );
}
