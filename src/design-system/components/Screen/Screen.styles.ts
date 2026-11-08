import { spacing } from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  screen: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  content: {
    paddingBottom: spacing.extraLarge,
  },
}));
