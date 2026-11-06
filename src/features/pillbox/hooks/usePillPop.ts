import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useReduceMotion } from "@/design-system/hooks/useReduceMotion";
import { duration } from "@/design-system/tokens";

const SQUEEZED_SCALE = 0.8;
const TILT_DEGREES = 14;
const squeezeTiming = { duration: duration.short / 2 };
const bounceSpring = { duration: duration.long, dampingRatio: 0.4 };

export function usePillPop() {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  function pop() {
    if (reduceMotion) return;
    const tilt = rotation.get() > 0 ? -TILT_DEGREES : TILT_DEGREES;
    scale.set(withSequence(withTiming(SQUEEZED_SCALE, squeezeTiming), withSpring(1, bounceSpring)));
    rotation.set(withSequence(withTiming(tilt, squeezeTiming), withSpring(0, bounceSpring)));
  }

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }, { rotate: `${rotation.get()}deg` }],
  }));

  return { popStyle, pop };
}
