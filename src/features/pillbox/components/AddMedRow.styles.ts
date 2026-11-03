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
  iconBadge: {
    width: sizes.iconBadge,
    height: sizes.iconBadge,
    borderRadius: radius.round,
    backgroundColor: themeColors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
  },
}));
