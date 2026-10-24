import { StyleSheet } from "react-native";

import { borderWidth, pressedOpacity, radius, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  cell: {
    flexGrow: 1,
    minHeight: sizes.calendarDayMinimumHeight,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.tiny,
    borderRadius: radius.calendarDay,
    borderWidth: borderWidth.regular,
    borderColor: "transparent",
  },
  pressed: {
    opacity: pressedOpacity,
  },
  number: {
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
});
