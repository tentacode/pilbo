import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  weekdays: {
    flexDirection: "row",
    gap: spacing.calendarGap,
    marginTop: spacing.calendarWeekdaysTop,
    marginBottom: spacing.small,
  },
  weekday: {
    flex: 1,
    textAlign: "center",
  },
});
