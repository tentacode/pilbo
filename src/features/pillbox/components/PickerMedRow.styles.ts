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
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.extraSmall,
    flexShrink: 1,
  },
  plusBadge: {
    width: sizes.iconBadge,
    height: sizes.iconBadge,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
    backgroundColor: colors.accentSoft,
  },
});
