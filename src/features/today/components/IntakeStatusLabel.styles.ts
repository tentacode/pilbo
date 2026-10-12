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
    backgroundColor: colors.accentSoft,
  },
  lateChip: {
    backgroundColor: colors.alertChip,
  },
  text: {
    flexShrink: 1,
  },
});
