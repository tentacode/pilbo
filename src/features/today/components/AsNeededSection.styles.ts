import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  card: {
    borderRadius: radius.largeCard,
    borderWidth: borderWidth.regular,
    borderColor: colors.line,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.cardBottom,
  },
});
