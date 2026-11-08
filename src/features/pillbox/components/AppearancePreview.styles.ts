import { radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  preview: {
    alignItems: "center",
    gap: spacing.medium,
    paddingTop: spacing.large,
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.previewBottom,
    borderRadius: radius.largeCard,
    backgroundColor: themeColors.fill,
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    paddingVertical: spacing.previewRowVertical,
    paddingHorizontal: spacing.previewRowHorizontal,
    borderRadius: radius.previewRow,
    backgroundColor: themeColors.surface,
  },
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
  randomizeButton: {
    position: "absolute",
    top: spacing.extraSmall,
    right: spacing.extraSmall,
  },
  largePill: {
    width: sizes.pillPreviewLarge,
    height: sizes.pillPreviewLarge,
  },
}));
