import { StyleSheet } from "react-native";

import { borderWidth, colors, radius } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
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
