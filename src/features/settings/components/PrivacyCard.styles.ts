import { radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.medium,
    padding: spacing.large,
  },
  iconBadge: {
    width: sizes.iconBadge,
    height: sizes.iconBadge,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
    backgroundColor: themeColors.turquoiseSoft,
  },
  text: {
    flex: 1,
  },
}));
