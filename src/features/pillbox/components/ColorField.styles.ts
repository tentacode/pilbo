import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  labelRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: spacing.medium,
    marginHorizontal: spacing.extraSmall,
    marginBottom: spacing.small,
  },
  halves: {
    flexDirection: "row",
    gap: spacing.extraSmall,
    padding: spacing.extraSmall,
    borderRadius: radius.segment,
    backgroundColor: colors.fill,
  },
  swatches: {
    flexDirection: "row",
    gap: spacing.extraSmall,
    marginTop: spacing.large,
  },
  customColorButton: {
    marginTop: spacing.customColorButtonTop,
  },
});
