import { StyleSheet } from "react-native";

import { borderWidth, colors, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.small,
    paddingTop: spacing.medium,
    paddingBottom: spacing.small,
    borderTopWidth: borderWidth.regular,
    borderTopColor: colors.line,
  },
  lateActions: {
    borderTopColor: colors.alertLine,
  },
  takeAction: {
    flexGrow: 1,
    flexShrink: 0,
    maxWidth: "100%",
  },
});
