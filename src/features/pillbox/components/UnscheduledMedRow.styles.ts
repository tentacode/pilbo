import { StyleSheet } from "react-native";

import { borderWidth, colors, sizes, spacing } from "@/design-system/tokens";

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
});
