import { StyleSheet } from "react-native";

import { radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  illustration: {
    marginHorizontal: spacing.large,
    borderRadius: radius.illustration,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  text: {
    gap: spacing.onboardingTextGap,
    paddingTop: spacing.huge,
    paddingHorizontal: spacing.extraLarge,
  },
});
