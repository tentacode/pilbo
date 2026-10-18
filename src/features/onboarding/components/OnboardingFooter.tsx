import type { ReactNode } from "react";
import { View } from "react-native";

import { OnboardingPager } from "./OnboardingPager";
import { styles } from "./OnboardingFooter.styles";

type OnboardingFooterProps = {
  currentIndex: number;
  count: number;
  children: ReactNode;
};

export function OnboardingFooter({ currentIndex, count, children }: OnboardingFooterProps) {
  return (
    <View style={styles.footer}>
      <OnboardingPager currentIndex={currentIndex} count={count} />
      <View style={styles.actions}>{children}</View>
    </View>
  );
}
