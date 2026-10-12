import { View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";

import { TodayEmptyIllustration } from "./TodayEmptyIllustration";
import { styles } from "./TodayEmptyState.styles";

export function TodayEmptyState() {
  return (
    <View style={styles.card}>
      <TodayEmptyIllustration />
      <Text variant="heading" accessibilityRole="header" style={styles.text}>
        {"Rien à prendre aujourd'hui"}
      </Text>
      <Text tone="secondary" style={styles.text}>
        Une journée tranquille côté pilulier. Prochaine prise lundi à 23:59.
      </Text>
    </View>
  );
}
