import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.large,
  },
  decoration: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.medium,
  },
  date: {
    flexShrink: 1,
  },
  title: {
    marginTop: spacing.extraSmall,
  },
  summary: {
    marginTop: spacing.small,
  },
});
