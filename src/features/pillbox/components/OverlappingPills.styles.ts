import { StyleSheet } from "react-native";

import { sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  stack: {
    flexDirection: "row",
    alignItems: "center",
  },
  pills: {
    flexDirection: "row",
    alignItems: "center",
  },
  hiddenCountSlot: {
    minWidth: sizes.pillStackCount,
    marginLeft: spacing.extraSmall,
  },
});
