import { radius, sizes, spacing } from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  grabber: {
    alignSelf: "center",
    width: sizes.grabberWidth,
    height: sizes.grabberHeight,
    marginBottom: spacing.extraSmall,
    borderRadius: radius.round,
    backgroundColor: themeColors.grabber,
  },
}));
