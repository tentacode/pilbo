import { radius, spacing } from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: themeColors.backdrop,
  },
  dismissArea: {
    flex: 1,
  },
  panel: {
    gap: spacing.medium,
    paddingTop: spacing.dialogPadding,
    paddingHorizontal: spacing.dialogPadding,
    borderTopLeftRadius: radius.largeCard,
    borderTopRightRadius: radius.largeCard,
    backgroundColor: themeColors.surface,
  },
  actions: {
    gap: spacing.small,
    marginTop: spacing.small,
  },
}));
