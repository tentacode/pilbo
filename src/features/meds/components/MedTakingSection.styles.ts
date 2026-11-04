import { StyleSheet } from "react-native";

import { pressedOpacity, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.extraSmall,
    minHeight: sizes.touchTarget,
    marginTop: spacing.extraSmall,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  summaryText: {
    flexShrink: 1,
    textAlign: "center",
  },
  undo: {
    alignItems: "center",
  },
});
