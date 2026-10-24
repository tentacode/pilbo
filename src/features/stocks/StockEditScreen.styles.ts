import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  content: {
    gap: spacing.extraLarge,
  },
  error: {
    marginHorizontal: spacing.extraSmall,
    marginTop: spacing.small,
  },
  stopButton: {
    alignSelf: "center",
  },
});
