import { StyleSheet } from "react-native";

import { borderWidth, radius, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
  },
  swatch: {
    width: sizes.legendSwatch,
    height: sizes.legendSwatch,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.legendSwatch,
    borderWidth: borderWidth.regular,
    borderColor: "transparent",
  },
  label: {
    flexShrink: 1,
  },
});
