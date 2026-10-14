import { View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";

import { TodayDoneIllustration } from "./TodayDoneIllustration";
import { styles } from "./TodayDoneState.styles";

export function TodayDoneState() {
  return (
    <View style={styles.card}>
      <TodayDoneIllustration />
      <Text variant="heading" accessibilityRole="header" style={styles.text}>
        {"C'est tout pour aujourd'hui"}
      </Text>
    </View>
  );
}
