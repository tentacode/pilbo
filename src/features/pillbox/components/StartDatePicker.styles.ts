import { borderWidth, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  picker: {
    paddingTop: spacing.medium,
    paddingHorizontal: spacing.medium,
    paddingBottom: spacing.medium,
    borderTopWidth: borderWidth.regular,
    borderTopColor: themeColors.separator,
  },
  grid: {
    gap: spacing.tiny,
  },
  week: {
    flexDirection: "row",
  },
  slot: {
    flex: 1,
  },
}));
