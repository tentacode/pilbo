import { StyleSheet } from "react-native";

import { colors, radius, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.medium,
    padding: spacing.large,
  },
  iconBadge: {
    width: sizes.iconBadge,
    height: sizes.iconBadge,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
    backgroundColor: colors.turquoiseSoft,
  },
  text: {
    flex: 1,
  },
});
