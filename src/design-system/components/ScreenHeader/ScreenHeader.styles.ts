import { StyleSheet } from "react-native";

import { spacing } from "../../tokens";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.medium,
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.large,
  },
  title: {
    flexShrink: 1,
  },
});
