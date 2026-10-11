import { StyleSheet } from "react-native";

import { colors, radius, sizes, spacing } from "../../tokens";

export const styles = StyleSheet.create({
  item: {
    flex: 1,
    minHeight: sizes.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.tiny,
    paddingVertical: spacing.extraSmall,
    borderRadius: radius.round,
  },
  selected: {
    backgroundColor: colors.accentSoft,
  },
  label: {
    textAlign: "center",
  },
});
