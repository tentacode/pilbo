import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  content: {
    gap: spacing.section,
    paddingHorizontal: spacing.large,
  },
  emptyContent: {
    paddingTop: spacing.large,
  },
  actions: {
    alignItems: "center",
  },
});
