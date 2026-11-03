import { borderWidth, radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
  },
  swatch: {
    width: sizes.legendSwatch,
    height: sizes.legendSwatch,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.legendSwatch,
    borderWidth: borderWidth.regular,
    borderColor: "transparent",
  },
  label: {
    flexShrink: 1,
  },
}));
