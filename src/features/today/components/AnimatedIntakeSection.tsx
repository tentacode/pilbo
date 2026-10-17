import type { ReactNode } from "react";
import Animated from "react-native-reanimated";

import {
  intakeLayoutTransition,
  intakeSectionEntering,
  intakeSectionExiting,
} from "@/features/today/utils/intakeCardAnimations";

type AnimatedIntakeSectionProps = {
  children: ReactNode;
};

export function AnimatedIntakeSection({ children }: AnimatedIntakeSectionProps) {
  return (
    <Animated.View
      entering={intakeSectionEntering}
      exiting={intakeSectionExiting}
      layout={intakeLayoutTransition}
    >
      {children}
    </Animated.View>
  );
}
