import { StyleSheet } from "react-native";

import { colors, pressedScale, radius, sizes, spacing } from "../../tokens";

export const styles = StyleSheet.create({
  button: {
    minHeight: sizes.buttonMinimumHeight,
    paddingHorizontal: spacing.buttonHorizontal,
    paddingVertical: spacing.medium,
    borderRadius: radius.round,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    backgroundColor: colors.inkPressed,
  },
  pressedScaled: {
    transform: [{ scale: pressedScale }],
  },
  label: {
    textAlign: "center",
  },
});
