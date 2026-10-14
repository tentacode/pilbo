import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.buttonIconGap,
    paddingVertical: spacing.chipVertical,
    paddingLeft: spacing.chipStart,
    paddingRight: spacing.chipEnd,
    borderRadius: radius.round,
  },
  text: {
    flexShrink: 1,
  },
});

export const appearanceStyles = StyleSheet.create({
  upcoming: { backgroundColor: colors.accentSoft },
  late: { backgroundColor: colors.alertChip },
  taken: { backgroundColor: colors.successChip },
  skipped: { backgroundColor: colors.skipChip },
});
