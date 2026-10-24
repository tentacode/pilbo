import { StyleSheet } from "react-native";

import {
  borderWidth,
  colors,
  disabledOpacity,
  fontFamily,
  fontSize,
  radius,
  sizes,
  spacing,
} from "../../tokens";

export const styles = StyleSheet.create({
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
    borderColor: colors.stepperBorder,
    backgroundColor: colors.surface,
  },
  pressed: {
    backgroundColor: colors.fill,
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
    backgroundColor: colors.surface,
    textAlign: "center",
    fontFamily: fontFamily.bold,
    fontSize: fontSize.body,
    fontVariant: ["tabular-nums"],
    color: colors.ink,
  },
});
