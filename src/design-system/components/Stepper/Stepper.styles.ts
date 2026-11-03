import {
  borderWidth,
  disabledOpacity,
  fontFamily,
  fontSize,
  radius,
  sizes,
  spacing,
} from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
    flexShrink: 0,
  },
  button: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
    borderWidth: borderWidth.regular,
    borderColor: themeColors.stepperBorder,
    backgroundColor: themeColors.surface,
  },
  pressed: {
    backgroundColor: themeColors.fill,
  },
  disabled: {
    opacity: disabledOpacity,
  },
  value: {
    minWidth: sizes.stepperValueMinimumWidth,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  input: {
    minWidth: sizes.stepperInputMinimumWidth,
    minHeight: sizes.touchTarget,
    paddingHorizontal: spacing.small,
    borderRadius: radius.segmentItem,
    backgroundColor: themeColors.surface,
    textAlign: "center",
    fontFamily: fontFamily.bold,
    fontSize: fontSize.body,
    fontVariant: ["tabular-nums"],
    color: themeColors.ink,
  },
}));
