import { radius, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  panel: {
    gap: spacing.small,
    marginTop: spacing.large,
    padding: spacing.colorPanelPadding,
    borderRadius: radius.colorPanel,
    backgroundColor: themeColors.fill,
  },
  label: {
    marginHorizontal: spacing.tiny,
  },
  secondLabel: {
    marginTop: spacing.small,
  },
}));
