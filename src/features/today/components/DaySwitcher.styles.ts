import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  switcher: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    marginLeft: -spacing.small,
  },
  date: {
    flexShrink: 1,
    textAlign: "center",
  },
});
