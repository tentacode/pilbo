import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, sizes, spacing } from "../../tokens";

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
  badge: {
    position: "absolute",
    top: -spacing.small,
    left: sizes.tabIcon - spacing.small,
    minWidth: sizes.tabBadge,
    minHeight: sizes.tabBadge,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.extraSmall,
    borderRadius: radius.round,
    borderWidth: borderWidth.regular,
    borderColor: colors.surface,
    backgroundColor: colors.ink,
  },
  label: {
    alignSelf: "stretch",
    textAlign: "center",
    paddingHorizontal: spacing.small,
  },
});
