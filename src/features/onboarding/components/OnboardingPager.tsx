import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { styles } from "./OnboardingPager.styles";

type OnboardingPagerProps = {
  currentIndex: number;
  count: number;
};

export function OnboardingPager({ currentIndex, count }: OnboardingPagerProps) {
  const { t } = useTranslation("onboarding");
  return (
    <View
      accessible
      accessibilityLabel={t("Étape {{current}} sur {{total}}", {
        current: currentIndex + 1,
        total: count,
      })}
      style={styles.indicator}
    >
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={[styles.dot, index === currentIndex && styles.currentDot]} />
      ))}
    </View>
  );
}
