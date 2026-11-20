import { borderWidth, radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.small,
    minHeight: sizes.listRowMinimumHeight,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
  },
  separatedRow: {
    borderTopWidth: borderWidth.regular,
    borderTopColor: themeColors.separator,
  },
  date: {
    flexShrink: 1,
  },
  tag: {
    paddingVertical: spacing.tiny,
    paddingHorizontal: spacing.small,
    borderRadius: radius.round,
    backgroundColor: themeColors.successChip,
  },
}));
