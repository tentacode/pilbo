import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  card: {
    borderRadius: radius.largeCard,
    borderWidth: borderWidth.regular,
    borderColor: colors.line,
    backgroundColor: colors.background,
    paddingTop: spacing.large,
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.cardBottom,
  },
  head: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.medium,
    paddingBottom: spacing.medium,
  },
});
