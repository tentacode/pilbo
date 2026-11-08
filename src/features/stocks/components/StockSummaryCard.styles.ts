import { radius, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  card: {
    gap: spacing.medium,
    borderRadius: radius.card,
    backgroundColor: themeColors.fill,
    padding: spacing.large,
  },
  lowCard: {
    backgroundColor: themeColors.alertBackground,
  },
  top: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.medium,
  },
  quantity: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.small,
    flexShrink: 1,
  },
}));
