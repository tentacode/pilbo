import { useEffect } from "react";
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useReduceMotion } from "@/design-system/hooks/useReduceMotion";
import { duration } from "@/design-system/tokens";

const FLOAT_OFFSET = 3;
const TWINKLE_OPACITY = 0.35;

export function useDoneIllustrationAnimation() {
  const reduceMotion = useReduceMotion();
  const floatProgress = useSharedValue(0);
  const twinkleProgress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(floatProgress);
      cancelAnimation(twinkleProgress);
      floatProgress.value = 0;
      twinkleProgress.value = 0;
      return;
    }
    const easing = Easing.inOut(Easing.sin);
    floatProgress.value = withRepeat(withTiming(1, { duration: duration.float, easing }), -1, true);
    twinkleProgress.value = withRepeat(
      withTiming(1, { duration: duration.twinkle, easing }),
      -1,
      true,
    );
  }, [reduceMotion, floatProgress, twinkleProgress]);

  const moonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (floatProgress.value * 2 - 1) * FLOAT_OFFSET }],
  }));
  const starsStyle = useAnimatedStyle(() => ({
    opacity: 1 - twinkleProgress.value * (1 - TWINKLE_OPACITY),
  }));

  return { moonStyle, starsStyle };
}
