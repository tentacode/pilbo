import { View } from "react-native";

import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { sizes } from "@/design-system/tokens";
import { formatIntakeTime } from "@/domain/intake";

import {
  formatEarlierIntakeAccessibilityLabel,
  formatMedNames,
} from "@/features/today/utils/formatters";
import type { TodayIntake } from "@/features/today/utils/todayTypes";
import { styles } from "./EarlierIntakeCard.styles";
import { IntakeStatusLabel } from "./IntakeStatusLabel";

type EarlierIntakeCardProps = {
  todayIntake: TodayIntake;
};

export function EarlierIntakeCard({ todayIntake }: EarlierIntakeCardProps) {
  const { intake, status } = todayIntake;

  return (
    <View
      accessible
      accessibilityLabel={formatEarlierIntakeAccessibilityLabel(todayIntake)}
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
