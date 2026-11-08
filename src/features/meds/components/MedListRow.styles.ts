import { sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    minHeight: sizes.medRowMinimumHeight,
    paddingTop: spacing.small,
    paddingBottom: spacing.listRowVertical,
    paddingHorizontal: spacing.large,
  },
  pressed: {
    backgroundColor: themeColors.separator,
  },
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
}));
