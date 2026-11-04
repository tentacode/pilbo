import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  back: {
    paddingHorizontal: spacing.large,
  },
  content: {
    gap: spacing.extraLarge,
    paddingHorizontal: spacing.large,
    paddingTop: spacing.extraSmall,
  },
  delete: {
    alignItems: "center",
  },
});
