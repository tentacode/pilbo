import { radius, sizes, spacing } from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const useToneStyles = createThemedStyles((themeColors) => ({
  neutral: { backgroundColor: themeColors.accentSoft },
  warning: { backgroundColor: themeColors.butterSoft },
}));

export const useStyles = createThemedStyles((themeColors) => ({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.extraLarge,
    backgroundColor: themeColors.backdrop,
  },
  card: {
    width: "100%",
    maxWidth: sizes.dialogMaximumWidth,
    alignItems: "center",
    gap: spacing.medium,
    padding: spacing.dialogPadding,
    borderRadius: radius.largeCard,
    backgroundColor: themeColors.surface,
  },
  iconBadge: {
    width: sizes.dialogIconBadge,
    height: sizes.dialogIconBadge,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
  },
  text: {
    textAlign: "center",
  },
  actions: {
    alignSelf: "stretch",
    gap: spacing.small,
    marginTop: spacing.small,
  },
}));
