import { borderWidth, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    paddingVertical: spacing.listRowVertical,
  },
  topBorder: {
    borderTopWidth: borderWidth.regular,
    borderTopColor: themeColors.line,
  },
  texts: {
    flex: 1,
    gap: spacing.extraSmall,
  },
  takenStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.extraSmall,
  },
  takenText: {
    flexShrink: 1,
  },
}));
