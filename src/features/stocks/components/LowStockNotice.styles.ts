import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    padding: spacing.large,
    borderRadius: radius.card,
    backgroundColor: colors.alertBackground,
  },
  pressed: {
    backgroundColor: colors.alertLine,
  },
  texts: {
    flex: 1,
    gap: spacing.extraSmall,
  },
});
