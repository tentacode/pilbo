import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";
import { duration } from "@/design-system/tokens";

import { TodayDoneIllustration } from "./TodayDoneIllustration";
import { styles } from "./TodayDoneState.styles";

const entering = FadeInDown.duration(duration.long).reduceMotion(ReduceMotion.System);

export function TodayDoneState() {
  const { t } = useTranslation("today");
  return (
    <Animated.View style={styles.card} entering={entering}>
      <TodayDoneIllustration />
      <Text variant="heading" accessibilityRole="header" style={styles.text}>
        {t("C'est tout pour aujourd'hui")}
      </Text>
    </Animated.View>
  );
}
