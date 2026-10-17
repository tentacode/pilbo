import {
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
  ReduceMotion,
  withTiming,
} from "react-native-reanimated";

import { duration } from "@/design-system/tokens";

const EXITING_SCALE = 0.92;

export const intakeLayoutTransition = LinearTransition.duration(duration.medium).reduceMotion(
  ReduceMotion.System,
);

export const intakeCardEntering = FadeInDown.duration(duration.medium)
  .delay(duration.short)
  .reduceMotion(ReduceMotion.System);

export function intakeCardExiting() {
  "worklet";
  const timing = { duration: duration.medium, reduceMotion: ReduceMotion.System };
  return {
    initialValues: { opacity: 1, transform: [{ scale: 1 }] },
    animations: {
      opacity: withTiming(0, timing),
      transform: [{ scale: withTiming(EXITING_SCALE, timing) }],
    },
  };
}

export const intakeSectionEntering = FadeIn.duration(duration.medium)
  .delay(duration.short)
  .reduceMotion(ReduceMotion.System);

export const intakeSectionExiting = FadeOut.duration(duration.short).reduceMotion(
  ReduceMotion.System,
);
