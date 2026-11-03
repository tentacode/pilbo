import { borderWidth, radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  option: {
    flexBasis: "30%",
    flexGrow: 1,
    minHeight: sizes.shapeOptionMinimumHeight,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.extraSmall,
    paddingHorizontal: spacing.tiny,
    paddingVertical: spacing.small,
    borderRadius: radius.shapeOption,
    borderWidth: borderWidth.selected,
    borderColor: "transparent",
    backgroundColor: themeColors.fill,
  },
  selected: {
    borderColor: themeColors.ink,
    backgroundColor: themeColors.surface,
  },
  label: {
    textAlign: "center",
  },
}));
