import { borderWidth } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  separated: {
    borderTopWidth: borderWidth.regular,
    borderTopColor: themeColors.separator,
  },
}));
