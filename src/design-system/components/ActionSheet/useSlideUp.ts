import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { duration } from "../../tokens";

// Layout animations (entering/exiting) ignore transforms in Release builds, so the slide is driven by a shared value.
export function useSlideUp() {
  const { height } = useWindowDimensions();
  const translateY = useSharedValue(height);

  useEffect(() => {
    translateY.set(withTiming(0, { duration: duration.medium, reduceMotion: ReduceMotion.System }));
  }, [translateY]);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }));
}
