import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  grid: {
    gap: spacing.calendarGap,
  },
  week: {
    flexDirection: "row",
    gap: spacing.calendarGap,
  },
  slot: {
    flex: 1,
  },
});
