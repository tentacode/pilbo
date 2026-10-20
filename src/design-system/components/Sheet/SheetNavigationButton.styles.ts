import { StyleSheet } from "react-native";

import { pressedOpacity, sizes, spacing } from "../../tokens";

export const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.tiny,
    minHeight: sizes.touchTarget,
    paddingHorizontal: spacing.navigationButtonHorizontal,
  },
  pressed: {
    opacity: pressedOpacity,
  },
});
