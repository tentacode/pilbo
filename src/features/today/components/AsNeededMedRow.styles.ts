import { borderWidth, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  row: {
    gap: spacing.small,
    paddingVertical: spacing.listRowVertical,
  },
  topBorder: {
    borderTopWidth: borderWidth.regular,
    borderTopColor: themeColors.line,
  },
  med: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
  },
  medInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
  },
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
  taken: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.small,
  },
  takenStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.extraSmall,
    flexShrink: 1,
  },
}));
