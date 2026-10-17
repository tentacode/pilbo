import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";

import { Text } from "@/design-system/components/Text/Text";
import { duration } from "@/design-system/tokens";

import { TodayDoneIllustration } from "./TodayDoneIllustration";
import { styles } from "./TodayDoneState.styles";

const entering = FadeInDown.duration(duration.long).reduceMotion(ReduceMotion.System);

export function TodayDoneState() {
  return (
    <Animated.View style={styles.card} entering={entering}>
      <TodayDoneIllustration />
      <Text variant="heading" accessibilityRole="header" style={styles.text}>
        {"C'est tout pour aujourd'hui"}
      </Text>
    </Animated.View>
  );
}
