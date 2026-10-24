import { StyleSheet } from "react-native";

import { colors, disabledOpacity, radius, sizes } from "../../tokens";

export const styles = StyleSheet.create({
  button: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: radius.round,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: disabledOpacity,
  },
});

export const variantStyles = StyleSheet.create({
  filled: { backgroundColor: colors.ink },
  soft: { backgroundColor: colors.fill },
  plain: {},
});
