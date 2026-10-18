import { StyleSheet } from "react-native";

import { colors, radius, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  indicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.stepIndicatorGap,
  },
  dot: {
    width: sizes.stepIndicatorDot,
    height: sizes.stepIndicatorDot,
    borderRadius: radius.round,
    backgroundColor: colors.stepIndicatorInactive,
  },
  currentDot: {
    width: sizes.stepIndicatorCurrentDot,
    backgroundColor: colors.ink,
  },
});
