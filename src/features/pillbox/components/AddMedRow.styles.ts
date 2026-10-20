import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    minHeight: sizes.listRowMinimumHeight,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
  },
  topBorder: {
    borderTopWidth: borderWidth.regular,
    borderTopColor: colors.separator,
  },
  pressed: {
    backgroundColor: colors.separator,
  },
  iconBadge: {
    width: sizes.iconBadge,
    height: sizes.iconBadge,
    borderRadius: radius.round,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
  },
});
