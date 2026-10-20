import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: sizes.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.tiny,
    borderRadius: radius.round,
    borderWidth: borderWidth.regular,
    borderColor: colors.lineStrong,
  },
  selected: {
    borderColor: colors.ink,
    backgroundColor: colors.ink,
  },
  label: {
    textAlign: "center",
  },
});
