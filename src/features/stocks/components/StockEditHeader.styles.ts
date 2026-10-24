import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.onboardingTextGap,
  },
  texts: {
    flex: 1,
    gap: spacing.extraSmall,
  },
});
