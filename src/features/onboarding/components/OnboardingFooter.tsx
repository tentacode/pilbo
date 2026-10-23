import type { ReactNode } from "react";
import { View } from "react-native";

import { OnboardingPager } from "./OnboardingPager";
import { styles } from "./OnboardingFooter.styles";

type OnboardingProgress = {
  currentIndex: number;
  count: number;
};

type OnboardingFooterProps = {
  progress?: OnboardingProgress;
  children: ReactNode;
};

export function OnboardingFooter({ progress, children }: OnboardingFooterProps) {
  return (
    <View style={styles.footer}>
      {progress ? (
        <OnboardingPager currentIndex={progress.currentIndex} count={progress.count} />
      ) : null}
      <View style={styles.actions}>{children}</View>
    </View>
  );
}
