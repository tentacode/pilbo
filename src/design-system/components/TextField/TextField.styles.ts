import { borderWidth, fontFamily, fontSize, sizes, spacing } from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  field: {
    gap: spacing.tiny,
    paddingTop: spacing.fieldTop,
    paddingBottom: spacing.fieldBottom,
    paddingHorizontal: spacing.large,
  },
  topBorder: {
    borderTopWidth: borderWidth.regular,
    borderTopColor: themeColors.separator,
  },
  input: {
    minHeight: sizes.inputMinimumHeight,
    paddingVertical: spacing.inputVertical,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.body,
    color: themeColors.ink,
  },
}));
