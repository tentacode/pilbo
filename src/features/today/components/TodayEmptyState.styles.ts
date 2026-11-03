import { borderWidth, radius, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  card: {
    alignItems: "center",
    gap: spacing.emptyStateGap,
    paddingTop: spacing.emptyStateTop,
    paddingHorizontal: spacing.emptyStateHorizontal,
    paddingBottom: spacing.emptyStateBottom,
    borderRadius: radius.largeCard,
    borderWidth: borderWidth.regular,
    borderColor: themeColors.line,
    backgroundColor: themeColors.surface,
  },
  text: {
    textAlign: "center",
  },
}));
