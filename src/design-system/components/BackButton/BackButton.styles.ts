import { StyleSheet } from "react-native";

import { pressedOpacity, sizes, spacing } from "../../tokens";

export const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.tiny,
    minHeight: sizes.touchTarget,
    paddingRight: spacing.small,
    marginLeft: -spacing.navigationButtonHorizontal,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  label: {
    flexShrink: 1,
  },
});
