import { StyleSheet } from "react-native";

import { borderWidth, colors, fontFamily, fontSize, sizes, spacing } from "../../tokens";

export const styles = StyleSheet.create({
  field: {
    gap: spacing.tiny,
    paddingTop: spacing.fieldTop,
    paddingBottom: spacing.fieldBottom,
    paddingHorizontal: spacing.large,
  },
  topBorder: {
    borderTopWidth: borderWidth.regular,
    borderTopColor: colors.separator,
  },
  input: {
    minHeight: sizes.inputMinimumHeight,
    paddingVertical: spacing.inputVertical,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.body,
    color: colors.ink,
  },
});
