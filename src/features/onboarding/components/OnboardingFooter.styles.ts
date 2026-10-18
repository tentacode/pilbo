import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  footer: {
    gap: spacing.onboardingTextGap,
    paddingTop: spacing.small,
    paddingHorizontal: spacing.large,
  },
  actions: {
    gap: spacing.extraSmall,
  },
});
