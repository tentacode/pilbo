import { StyleSheet } from "react-native";

import { borderWidth, colors, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  row: {
    gap: spacing.small,
    paddingVertical: spacing.listRowVertical,
  },
  topBorder: {
    borderTopWidth: borderWidth.regular,
    borderTopColor: colors.line,
  },
  med: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
  },
  medInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
  },
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
  taken: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.small,
  },
  takenStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.extraSmall,
    flexShrink: 1,
  },
});
