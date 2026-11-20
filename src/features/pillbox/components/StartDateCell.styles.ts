import {
  borderWidth,
  disabledOpacity,
  pressedOpacity,
  radius,
  sizes,
} from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  cell: {
    flexGrow: 1,
    minHeight: sizes.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
    borderWidth: borderWidth.regular,
    borderColor: "transparent",
  },
  today: {
    borderColor: themeColors.inkSecondary,
  },
  selected: {
    borderColor: themeColors.ink,
    backgroundColor: themeColors.ink,
  },
  disabled: {
    opacity: disabledOpacity,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  number: {
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
}));
