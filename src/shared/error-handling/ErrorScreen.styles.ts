import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.large,
    gap: spacing.medium,
  },
  action: {
    marginTop: spacing.extraLarge,
    alignItems: "flex-start",
  },
});
