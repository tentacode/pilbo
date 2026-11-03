import { borderWidth, radius, sizes, spacing } from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  item: {
    flex: 1,
    minHeight: sizes.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.tiny,
    paddingVertical: spacing.extraSmall,
    borderRadius: radius.round,
  },
  selected: {
    backgroundColor: themeColors.accentSoft,
  },
  badge: {
    position: "absolute",
    top: -spacing.small,
    left: sizes.tabIcon - spacing.small,
    minWidth: sizes.tabBadge,
    minHeight: sizes.tabBadge,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.extraSmall,
    borderRadius: radius.round,
    borderWidth: borderWidth.regular,
    borderColor: themeColors.surface,
    backgroundColor: themeColors.ink,
  },
  label: {
    alignSelf: "stretch",
    textAlign: "center",
    paddingHorizontal: spacing.small,
  },
}));
