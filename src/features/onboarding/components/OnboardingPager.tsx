import { View } from "react-native";

import { styles } from "./OnboardingPager.styles";

type OnboardingPagerProps = {
  currentIndex: number;
  count: number;
};

export function OnboardingPager({ currentIndex, count }: OnboardingPagerProps) {
  return (
    <View
      accessible
      accessibilityLabel={`Étape ${currentIndex + 1} sur ${count}`}
      style={styles.indicator}
    >
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={[styles.dot, index === currentIndex && styles.currentDot]} />
      ))}
    </View>
  );
}
