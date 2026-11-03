import { borderWidth, pressedOpacity, radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  button: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
    minHeight: sizes.buttonMinimumHeight,
    paddingHorizontal: spacing.buttonHorizontal,
    borderRadius: radius.round,
    borderWidth: borderWidth.selected,
    borderColor: themeColors.lineStrong,
    backgroundColor: themeColors.surface,
  },
  selected: {
    borderColor: themeColors.ink,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  wheel: {
    width: sizes.colorDot,
    height: sizes.colorDot,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: radius.round,
    borderWidth: borderWidth.thin,
    borderColor: themeColors.colorDotOutline,
  },
  center: {
    position: "absolute",
    width: sizes.colorWheelCenter,
    height: sizes.colorWheelCenter,
    borderRadius: radius.round,
    borderWidth: borderWidth.thin,
    borderColor: themeColors.colorDotOutline,
  },
  label: {
    flexShrink: 1,
  },
}));
