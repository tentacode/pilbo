import { StyleSheet } from "react-native";

import { colors, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.medium,
    minHeight: sizes.listRowMinimumHeight,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
  },
  pressed: {
    backgroundColor: colors.separator,
  },
  text: {
    flexShrink: 1,
  },
});
