import { StyleSheet } from "react-native";

import { colors, radius, sizes, spacing } from "../../tokens";

export const toneStyles = StyleSheet.create({
  neutral: { backgroundColor: colors.accentSoft },
  warning: { backgroundColor: colors.butterSoft },
});

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.extraLarge,
    backgroundColor: colors.backdrop,
  },
  card: {
    width: "100%",
    maxWidth: sizes.dialogMaximumWidth,
    alignItems: "center",
    gap: spacing.medium,
    padding: spacing.dialogPadding,
    borderRadius: radius.largeCard,
    backgroundColor: colors.background,
  },
  iconBadge: {
    width: sizes.dialogIconBadge,
    height: sizes.dialogIconBadge,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
  },
  text: {
    textAlign: "center",
  },
  actions: {
    alignSelf: "stretch",
    gap: spacing.small,
    marginTop: spacing.small,
  },
});
