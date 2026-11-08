import { sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    minHeight: sizes.listRowMinimumHeight,
    paddingTop: spacing.medium,
    paddingBottom: spacing.compactCardVertical,
    paddingHorizontal: spacing.large,
  },
  pressed: {
    backgroundColor: themeColors.separator,
  },
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.buttonIconGap,
  },
  titleText: {
    flexShrink: 1,
  },
  bar: {
    marginTop: spacing.small,
  },
}));
