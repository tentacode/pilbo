import { StyleSheet } from "react-native";

import { sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    minHeight: sizes.listRowMinimumHeight,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
  },
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
});
