import { radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: radius.card,
    backgroundColor: themeColors.alertNotice,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    paddingVertical: spacing.large,
    paddingLeft: spacing.large,
  },
  pressed: {
    backgroundColor: themeColors.alertNoticePressed,
  },
  texts: {
    flex: 1,
    gap: spacing.extraSmall,
  },
  dismissButton: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    margin: spacing.small,
    borderRadius: radius.round,
    alignItems: "center",
    justifyContent: "center",
  },
}));
