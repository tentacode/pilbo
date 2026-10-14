import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  notice: {
    alignItems: "flex-start",
    gap: spacing.small,
    padding: spacing.large,
    borderRadius: radius.card,
    backgroundColor: colors.fill,
  },
});
