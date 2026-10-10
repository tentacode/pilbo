import { StyleSheet } from "react-native";

import { colors, radius, sizes } from "../../tokens";

export const styles = StyleSheet.create({
  button: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: radius.round,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
  },
});
