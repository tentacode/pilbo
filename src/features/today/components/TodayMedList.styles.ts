import { borderWidth, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  row: {
    paddingVertical: spacing.listRowVertical,
    borderTopWidth: borderWidth.regular,
    borderTopColor: themeColors.line,
  },
  lateRow: {
    borderTopColor: themeColors.alertSeparator,
  },
  borderlessRow: {
    borderTopWidth: 0,
  },
}));
