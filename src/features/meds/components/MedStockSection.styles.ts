import { StyleSheet } from "react-native";

import { colors, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    minHeight: sizes.listRowMinimumHeight,
    paddingTop: spacing.medium,
    paddingBottom: spacing.compactCardVertical,
    paddingHorizontal: spacing.large,
  },
  pressed: {
    backgroundColor: colors.separator,
  },
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.buttonIconGap,
  },
  titleText: {
    flexShrink: 1,
  },
  bar: {
    marginTop: spacing.small,
  },
});
