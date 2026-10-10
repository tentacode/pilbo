import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    backgroundColor: colors.fill,
    paddingTop: spacing.medium,
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.large,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.medium,
  },
  schedule: {
    marginTop: spacing.extraSmall,
  },
  meds: {
    gap: spacing.small,
    marginTop: spacing.medium,
  },
});
