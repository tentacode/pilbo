import { radius, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.buttonIconGap,
    paddingVertical: spacing.chipVertical,
    paddingLeft: spacing.chipStart,
    paddingRight: spacing.chipEnd,
    borderRadius: radius.round,
  },
  lowChip: {
    backgroundColor: themeColors.alertChip,
  },
  sufficientChip: {
    backgroundColor: themeColors.skipChip,
  },
  text: {
    flexShrink: 1,
  },
}));
