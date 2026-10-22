import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, sizes, spacing } from "../../tokens";

export const styles = StyleSheet.create({
  swatch: {
    flex: 1,
    aspectRatio: 1,
    minWidth: sizes.touchTarget,
    minHeight: sizes.touchTarget,
    padding: spacing.swatchRingGap,
    borderRadius: radius.round,
    borderWidth: borderWidth.selected,
    borderColor: "transparent",
  },
  selected: {
    borderColor: colors.ink,
  },
  color: {
    flex: 1,
    borderRadius: radius.round,
    borderWidth: borderWidth.thin,
    borderColor: colors.swatchOutline,
  },
});
