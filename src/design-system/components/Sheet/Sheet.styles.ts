import { StyleSheet } from "react-native";

import { borderWidth, colors, spacing } from "../../tokens";

export const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.large,
    paddingTop: spacing.medium,
    paddingBottom: spacing.extraLarge,
  },
  footer: {
    paddingTop: spacing.sheetFooterTop,
    paddingHorizontal: spacing.large,
    borderTopWidth: borderWidth.regular,
    borderTopColor: colors.line,
    backgroundColor: colors.background,
  },
});
