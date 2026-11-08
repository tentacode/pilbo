import { sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.medium,
    minHeight: sizes.listRowMinimumHeight,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
  },
  pressed: {
    backgroundColor: themeColors.separator,
  },
  text: {
    flexShrink: 1,
  },
}));
