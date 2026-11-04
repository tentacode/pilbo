import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    gap: spacing.small,
  },
  stackedContainer: {
    alignItems: "flex-start",
    paddingTop: spacing.extraSmall,
  },
  count: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.extraSmall,
  },
  number: {
    fontVariant: ["tabular-nums"],
  },
});
