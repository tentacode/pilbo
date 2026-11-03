import { borderWidth, radius, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  card: {
    borderRadius: radius.largeCard,
    borderWidth: borderWidth.regular,
    borderColor: themeColors.line,
    backgroundColor: "transparent",
    paddingTop: spacing.large,
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.cardBottom,
  },
  head: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.medium,
    paddingBottom: spacing.medium,
  },
}));
