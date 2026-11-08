import { radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  indicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.stepIndicatorGap,
  },
  dot: {
    width: sizes.stepIndicatorDot,
    height: sizes.stepIndicatorDot,
    borderRadius: radius.round,
    backgroundColor: themeColors.stepIndicatorInactive,
  },
  currentDot: {
    width: sizes.stepIndicatorCurrentDot,
    backgroundColor: themeColors.ink,
  },
}));
