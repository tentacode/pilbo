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
import { createThemedStyles } from "../../utils/createThemedStyles";

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

export const useVariantStyles = createThemedStyles((themeColors) => ({
  primary: {
    minHeight: sizes.buttonMinimumHeight,
    paddingHorizontal: spacing.buttonHorizontal,
    gap: spacing.small,
    backgroundColor: themeColors.ink,
  },
  prominent: {
    minHeight: sizes.buttonMinimumHeight,
    paddingHorizontal: spacing.buttonHorizontal,
    gap: spacing.small,
    borderWidth: borderWidth.regular,
    borderColor: themeColors.prominentBorder,
    backgroundColor: themeColors.prominentBackground,
  },
  secondary: {
    minHeight: sizes.touchTarget,
    paddingHorizontal: spacing.buttonHorizontalCompact,
    gap: spacing.buttonIconGap,
    borderWidth: borderWidth.regular,
    borderColor: themeColors.lineStrong,
    backgroundColor: themeColors.surfaceTranslucent,
  },
  text: {
    minHeight: sizes.buttonMinimumHeight,
    paddingHorizontal: spacing.buttonHorizontalCompact,
    gap: spacing.buttonIconGap,
  },
}));

export const pressedVariantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.inkPressed },
  prominent: { backgroundColor: colors.prominentBackgroundPressed },
  secondary: { backgroundColor: colors.fill },
  text: { backgroundColor: colors.fill },
});

export const sizeStyles = StyleSheet.create({
  regular: {},
  large: { minHeight: sizes.buttonMinimumHeight },
});
