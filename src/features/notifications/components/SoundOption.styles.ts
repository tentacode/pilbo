import { borderWidth, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    minHeight: sizes.listRowMinimumHeight,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
  },
  topBorder: {
    borderTopWidth: borderWidth.regular,
    borderTopColor: themeColors.separator,
  },
  pressed: {
    backgroundColor: themeColors.separator,
  },
  name: {
    flex: 1,
  },
}));
