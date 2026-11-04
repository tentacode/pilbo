import { borderWidth, pressedOpacity, radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    minHeight: sizes.medRowMinimumHeight,
    paddingVertical: spacing.small,
    paddingLeft: spacing.large,
    paddingRight: spacing.medium,
    borderRadius: radius.group,
    borderWidth: borderWidth.regular,
    borderColor: themeColors.doneLine,
    backgroundColor: themeColors.doneBackground,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
}));
