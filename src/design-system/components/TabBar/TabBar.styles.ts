import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, shadow, sizes, spacing } from "../../tokens";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.large,
    paddingTop: spacing.small,
  },
  bar: {
    flexDirection: "row",
    minHeight: sizes.tabBarMinimumHeight,
    gap: spacing.tiny,
    padding: spacing.extraSmall,
    borderRadius: radius.round,
    borderWidth: borderWidth.thin,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    ...shadow.floating,
  },
});
