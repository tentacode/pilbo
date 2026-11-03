import { borderWidth, pressedOpacity, radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  block: {
    alignItems: "center",
    gap: spacing.emptyStateGap,
    paddingTop: spacing.previewTop,
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.large,
    borderRadius: radius.largeCard,
    backgroundColor: themeColors.fill,
  },
  preview: {
    width: sizes.pillPreviewButton,
    height: sizes.pillPreviewButton,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
    backgroundColor: themeColors.surface,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  editBadge: {
    position: "absolute",
    right: spacing.tiny,
    bottom: spacing.tiny,
    width: sizes.iconBadge,
    height: sizes.iconBadge,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
    borderWidth: borderWidth.thick,
    borderColor: themeColors.fill,
    backgroundColor: themeColors.ink,
  },
  description: {
    textAlign: "center",
  },
}));
