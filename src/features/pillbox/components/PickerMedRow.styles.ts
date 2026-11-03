import { borderWidth, radius, sizes, spacing } from "@/design-system/tokens";
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
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.extraSmall,
    flexShrink: 1,
  },
  plusBadge: {
    width: sizes.iconBadge,
    height: sizes.iconBadge,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
    backgroundColor: themeColors.accentSoft,
  },
}));
