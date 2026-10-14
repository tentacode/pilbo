import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: spacing.emptyStateGap,
    paddingTop: spacing.emptyStateTop,
    paddingHorizontal: spacing.emptyStateHorizontal,
    paddingBottom: spacing.emptyStateBottom,
    borderRadius: radius.largeCard,
    backgroundColor: colors.fill,
  },
  text: {
    textAlign: "center",
  },
});
