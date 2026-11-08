import { radius } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  group: {
    borderRadius: radius.group,
    backgroundColor: themeColors.fill,
    overflow: "hidden",
  },
}));
