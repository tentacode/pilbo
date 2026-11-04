import { borderWidth, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  separator: {
    marginLeft: spacing.large + sizes.pillInPicker + spacing.medium,
    borderTopWidth: borderWidth.regular,
    borderTopColor: themeColors.separator,
  },
}));
