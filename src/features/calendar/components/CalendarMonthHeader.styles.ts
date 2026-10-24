import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.medium,
  },
  title: {
    flexShrink: 1,
  },
  navigation: {
    flexDirection: "row",
    gap: spacing.small,
  },
});
