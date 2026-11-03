import { borderWidth, spacing } from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  sheet: {
    flex: 1,
    backgroundColor: themeColors.background,
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
    borderTopColor: themeColors.line,
    backgroundColor: themeColors.background,
  },
}));
