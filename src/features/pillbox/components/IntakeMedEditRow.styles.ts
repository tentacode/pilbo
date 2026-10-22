import { StyleSheet } from "react-native";

import { borderWidth, colors, pressedOpacity, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
    minHeight: sizes.listRowMinimumHeight,
    paddingVertical: spacing.small,
    paddingRight: spacing.large,
  },
  stackedRow: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 0,
    paddingBottom: spacing.medium,
  },
  stackedMedButton: {
    flex: 0,
  },
  stackedStepper: {
    alignSelf: "flex-end",
  },
  topBorder: {
    borderTopWidth: borderWidth.regular,
    borderTopColor: colors.separator,
  },
  medButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    minHeight: sizes.touchTarget,
    paddingLeft: spacing.large,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
});
