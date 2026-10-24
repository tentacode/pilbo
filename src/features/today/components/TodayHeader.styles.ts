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
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.medium,
  },
  title: {
    marginTop: spacing.extraSmall,
  },
  todayLink: {
    alignSelf: "flex-start",
    marginLeft: -spacing.buttonHorizontalCompact,
  },
});
