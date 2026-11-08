import { createShadows } from "@/design-system/shadows";
import { borderWidth, radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.emptyStateGap,
    minHeight: sizes.halfOptionMinimumHeight,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.extraSmall,
    borderRadius: radius.segmentItem,
  },
  selected: {
    ...createShadows(themeColors).raised,
    backgroundColor: themeColors.surface,
  },
  dot: {
    width: sizes.colorDot,
    height: sizes.colorDot,
    borderRadius: radius.round,
    borderWidth: borderWidth.thin,
    borderColor: themeColors.colorDotOutline,
  },
  label: {
    flexShrink: 1,
  },
}));
