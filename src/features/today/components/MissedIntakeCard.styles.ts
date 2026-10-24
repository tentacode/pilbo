import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, spacing } from "@/design-system/tokens";

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
  head: {
    paddingBottom: spacing.medium,
  },
});
