import { sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.medium,
    minHeight: sizes.listRowMinimumHeight,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
  },
  stackedRow: {
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    gap: spacing.small,
    paddingVertical: spacing.medium,
  },
  pressed: {
    backgroundColor: themeColors.separator,
  },
  inlineLabel: {
    flexShrink: 1,
  },
  trailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.extraSmall,
    flexShrink: 0,
  },
  stackedTrailing: {
    alignSelf: "flex-start",
  },
  fullWidthTrailing: {
    alignSelf: "stretch",
    flexDirection: "column",
    alignItems: "stretch",
  },
}));
