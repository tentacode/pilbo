import { borderWidth, pressedOpacity, radius, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  card: {
    borderRadius: radius.largeCard,
    borderWidth: borderWidth.regular,
    borderColor: themeColors.alertLine,
    backgroundColor: themeColors.alertBackground,
    paddingTop: spacing.large,
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.cardBottom,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.medium,
    paddingBottom: spacing.medium,
  },
}));
