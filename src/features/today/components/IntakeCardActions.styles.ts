import { borderWidth, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.small,
    paddingTop: spacing.medium,
    paddingBottom: spacing.small,
    borderTopWidth: borderWidth.regular,
    borderTopColor: themeColors.line,
  },
  lateActions: {
    borderTopColor: themeColors.alertSeparator,
  },
  takeAction: {
    flexGrow: 1,
    flexShrink: 0,
    maxWidth: "100%",
  },
}));
