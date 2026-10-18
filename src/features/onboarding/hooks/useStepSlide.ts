import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { useReduceMotion } from "@/design-system/hooks/useReduceMotion";
import { duration } from "@/design-system/tokens";

const timing = { duration: duration.medium };

// Layout animations (entering/exiting) ignore transforms in Release builds, so the slide is driven by a shared value.
export function useStepSlide(stepIndex: number) {
  const { width } = useWindowDimensions();
  const reduceMotion = useReduceMotion();
  const [slidStepIndex, setSlidStepIndex] = useState(stepIndex);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion || stepIndex === slidStepIndex) return;
    translateX.set(
      withTiming(-width, timing, (finished) => {
        if (!finished) return;
        translateX.set(width);
        scheduleOnRN(setSlidStepIndex, stepIndex);
      }),
    );
  }, [reduceMotion, slidStepIndex, stepIndex, translateX, width]);

  useEffect(() => {
    translateX.set(withTiming(0, timing));
  }, [slidStepIndex, translateX]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.get() }],
  }));

  return {
    displayedStepIndex: reduceMotion ? stepIndex : slidStepIndex,
    slideStyle,
  };
}
