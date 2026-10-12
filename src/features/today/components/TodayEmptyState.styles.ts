import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: spacing.emptyStateGap,
    paddingTop: spacing.emptyStateTop,
    paddingHorizontal: spacing.emptyStateHorizontal,
    paddingBottom: spacing.emptyStateBottom,
    borderRadius: radius.largeCard,
    borderWidth: borderWidth.regular,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  text: {
    textAlign: "center",
  },
});
