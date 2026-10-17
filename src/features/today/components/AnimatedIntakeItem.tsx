import type { ReactNode } from "react";
import Animated from "react-native-reanimated";

import {
  intakeCardEntering,
  intakeCardExiting,
  intakeLayoutTransition,
} from "@/features/today/utils/intakeCardAnimations";

type AnimatedIntakeItemProps = {
  children: ReactNode;
};

export function AnimatedIntakeItem({ children }: AnimatedIntakeItemProps) {
  return (
    <Animated.View
      entering={intakeCardEntering}
      exiting={intakeCardExiting}
      layout={intakeLayoutTransition}
    >
      {children}
    </Animated.View>
  );
}
