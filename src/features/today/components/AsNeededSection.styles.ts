import { borderWidth, radius, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  card: {
    borderRadius: radius.largeCard,
    borderWidth: borderWidth.regular,
    borderColor: themeColors.line,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.cardBottom,
  },
}));
