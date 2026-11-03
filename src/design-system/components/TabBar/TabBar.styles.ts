import { borderWidth, createShadows, radius, sizes, spacing } from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  container: {
    backgroundColor: themeColors.background,
    paddingHorizontal: spacing.large,
    paddingTop: spacing.small,
  },
  bar: {
    flexDirection: "row",
    minHeight: sizes.tabBarMinimumHeight,
    gap: spacing.tiny,
    padding: spacing.extraSmall,
    borderRadius: radius.round,
    borderWidth: borderWidth.thin,
    borderColor: themeColors.line,
    backgroundColor: themeColors.surface,
    ...createShadows(themeColors).floating,
  },
}));
