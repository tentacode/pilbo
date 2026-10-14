import { StyleSheet } from "react-native";

import {
  borderWidth,
  colors,
  disabledOpacity,
  pressedScale,
  radius,
  sizes,
  spacing,
} from "../../tokens";

export const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.medium,
    borderRadius: radius.round,
  },
  pressedScaled: {
    transform: [{ scale: pressedScale }],
  },
  disabled: {
    opacity: disabledOpacity,
  },
  label: {
    flexShrink: 1,
    textAlign: "center",
  },
});

export const variantStyles = StyleSheet.create({
  primary: {
    minHeight: sizes.buttonMinimumHeight,
    paddingHorizontal: spacing.buttonHorizontal,
    gap: spacing.small,
    backgroundColor: colors.ink,
  },
  secondary: {
    minHeight: sizes.touchTarget,
    paddingHorizontal: spacing.buttonHorizontalCompact,
    gap: spacing.buttonIconGap,
    borderWidth: borderWidth.regular,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surfaceTranslucent,
  },
  text: {
    minHeight: sizes.buttonMinimumHeight,
    paddingHorizontal: spacing.buttonHorizontalCompact,
    gap: spacing.buttonIconGap,
  },
});

export const pressedVariantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.inkPressed },
  secondary: { backgroundColor: colors.fill },
  text: { backgroundColor: colors.fill },
});

export const sizeStyles = StyleSheet.create({
  regular: {},
  large: { minHeight: sizes.buttonMinimumHeight },
});
