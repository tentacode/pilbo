import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  days: {
    gap: spacing.dayButtonGap,
    marginTop: spacing.small,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.dayButtonGap,
  },
});
