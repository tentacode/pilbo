import { StyleSheet } from "react-native";

import { borderWidth, colors, pressedOpacity, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  card: {
    borderRadius: radius.largeCard,
    borderWidth: borderWidth.regular,
    borderColor: colors.alertLine,
    backgroundColor: colors.alertBackground,
    paddingTop: spacing.large,
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.cardBottom,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.medium,
    paddingBottom: spacing.medium,
  },
});
