import { StyleSheet } from "react-native";

import { borderWidth, colors, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.listRowVertical,
    borderTopWidth: borderWidth.regular,
    borderTopColor: colors.line,
  },
  lateRow: {
    borderTopColor: colors.alertLine,
  },
  borderlessRow: {
    borderTopWidth: 0,
  },
});
