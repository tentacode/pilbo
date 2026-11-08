import { radius, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  notice: {
    alignItems: "flex-start",
    gap: spacing.small,
    padding: spacing.large,
    borderRadius: radius.card,
    backgroundColor: themeColors.fill,
  },
}));
