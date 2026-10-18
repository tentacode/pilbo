import { StyleSheet } from "react-native";

import { spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.section,
    alignItems: "flex-start",
    gap: spacing.medium,
  },
  developerSection: {
    paddingHorizontal: spacing.large,
    alignItems: "flex-start",
    gap: spacing.medium,
  },
});
