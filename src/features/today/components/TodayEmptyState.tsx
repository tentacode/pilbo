import { View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";

import { formatUpcomingIntakeSentence } from "@/features/today/utils/formatters";
import type { UpcomingIntake } from "@/features/today/utils/todayTypes";
import { TodayEmptyIllustration } from "./TodayEmptyIllustration";
import { styles } from "./TodayEmptyState.styles";

type TodayEmptyStateProps = {
  upcomingIntake: UpcomingIntake | null;
};

export function TodayEmptyState({ upcomingIntake }: TodayEmptyStateProps) {
  const description = upcomingIntake
    ? `Une journée tranquille côté pilulier. ${formatUpcomingIntakeSentence(upcomingIntake)}`
    : "Une journée tranquille côté pilulier.";

  return (
    <View style={styles.card}>
      <TodayEmptyIllustration />
      <Text variant="heading" accessibilityRole="header" style={styles.text}>
        {"Rien à prendre aujourd'hui"}
      </Text>
      <Text tone="secondary" style={styles.text}>
        {description}
      </Text>
    </View>
  );
}
