import { radius, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  labelRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: spacing.medium,
    marginHorizontal: spacing.extraSmall,
    marginBottom: spacing.small,
  },
  halves: {
    flexDirection: "row",
    gap: spacing.extraSmall,
    padding: spacing.extraSmall,
    borderRadius: radius.segment,
    backgroundColor: themeColors.fill,
  },
  swatches: {
    flexDirection: "row",
    gap: spacing.extraSmall,
    marginTop: spacing.large,
  },
  customColorButton: {
    marginTop: spacing.customColorButtonTop,
  },
}));
