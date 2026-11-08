import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  screen: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  step: {
    flex: 1,
  },
}));
