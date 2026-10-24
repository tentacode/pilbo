import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  card: {
    gap: spacing.medium,
    borderRadius: radius.card,
    backgroundColor: colors.fill,
    paddingTop: spacing.compactCardVertical,
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.large,
  },
  lowCard: {
    backgroundColor: colors.alertBackground,
  },
  pressed: {
    backgroundColor: colors.separator,
  },
  lowPressed: {
    backgroundColor: colors.alertSeparator,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
  },
  stackedRow: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
  stackedTexts: {
    flex: 0,
    alignSelf: "stretch",
  },
});
