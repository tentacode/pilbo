import { StyleSheet } from "react-native";

import { spacing } from "../../tokens";

export const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.buttonIconGap,
  },
  label: {
    flexShrink: 1,
    textAlign: "center",
  },
});
