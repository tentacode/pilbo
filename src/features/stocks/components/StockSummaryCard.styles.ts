import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  card: {
    gap: spacing.medium,
    borderRadius: radius.card,
    backgroundColor: colors.fill,
    padding: spacing.large,
  },
  lowCard: {
    backgroundColor: colors.alertBackground,
  },
  top: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.medium,
  },
  quantity: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.small,
    flexShrink: 1,
  },
});
