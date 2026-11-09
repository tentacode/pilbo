import { sizes, spacing } from "@/design-system/tokens";
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
  pressed: {
    backgroundColor: themeColors.separator,
  },
  value: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.extraSmall,
  },
  valueText: {
    flexShrink: 1,
    textAlign: "right",
  },
}));
