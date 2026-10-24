import { StyleSheet } from "react-native";

import { colors, radius, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: radius.card,
    backgroundColor: colors.alertBackground,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    paddingVertical: spacing.large,
    paddingLeft: spacing.large,
  },
  pressed: {
    backgroundColor: colors.alertLine,
  },
  texts: {
    flex: 1,
    gap: spacing.extraSmall,
  },
  dismissButton: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    margin: spacing.small,
    borderRadius: radius.round,
    alignItems: "center",
    justifyContent: "center",
  },
});
