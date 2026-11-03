import { borderWidth, radius, sizes, spacing } from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  swatch: {
    flex: 1,
    aspectRatio: 1,
    minWidth: sizes.touchTarget,
    minHeight: sizes.touchTarget,
    padding: spacing.swatchRingGap,
    borderRadius: radius.round,
    borderWidth: borderWidth.selected,
    borderColor: "transparent",
  },
  selected: {
    borderColor: themeColors.ink,
  },
  color: {
    flex: 1,
    borderRadius: radius.round,
    borderWidth: borderWidth.thin,
    borderColor: themeColors.swatchOutline,
  },
}));
