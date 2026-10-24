import { StyleSheet } from "react-native";

import { borderWidth, colors, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    paddingVertical: spacing.listRowVertical,
  },
  topBorder: {
    borderTopWidth: borderWidth.regular,
    borderTopColor: colors.line,
  },
  texts: {
    flex: 1,
    gap: spacing.extraSmall,
  },
  takenStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.extraSmall,
  },
  takenText: {
    flexShrink: 1,
  },
});
