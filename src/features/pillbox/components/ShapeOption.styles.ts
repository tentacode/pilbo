import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  option: {
    flex: 1,
    minHeight: sizes.shapeOptionMinimumHeight,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.extraSmall,
    paddingHorizontal: spacing.tiny,
    paddingVertical: spacing.small,
    borderRadius: radius.shapeOption,
    borderWidth: borderWidth.selected,
    borderColor: "transparent",
    backgroundColor: colors.fill,
  },
  selected: {
    borderColor: colors.ink,
    backgroundColor: colors.surface,
  },
  label: {
    textAlign: "center",
  },
});
