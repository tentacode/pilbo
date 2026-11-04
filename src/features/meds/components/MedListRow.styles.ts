import { StyleSheet } from "react-native";

import { colors, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    minHeight: sizes.medRowMinimumHeight,
    paddingTop: spacing.small,
    paddingBottom: spacing.listRowVertical,
    paddingHorizontal: spacing.large,
  },
  pressed: {
    backgroundColor: colors.separator,
  },
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
});
