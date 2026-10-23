import { StyleSheet } from "react-native";

import { colors, radius, shadow, sizes, spacing } from "../../tokens";

export const styles = StyleSheet.create({
  control: {
    flexDirection: "row",
    gap: spacing.extraSmall,
    padding: spacing.extraSmall,
    borderRadius: radius.segment,
    backgroundColor: colors.fill,
  },
  stackedControl: {
    flexDirection: "column",
  },
  option: {
    flex: 1,
    minHeight: sizes.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.extraSmall,
    borderRadius: radius.segmentItem,
  },
  stackedOption: {
    flex: 0,
    paddingVertical: spacing.small,
  },
  selectedOption: {
    ...shadow.raised,
    backgroundColor: colors.surface,
  },
  label: {
    textAlign: "center",
  },
  measureContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: sizes.unconstrainedMeasureWidth,
    flexDirection: "row",
    alignItems: "flex-start",
    opacity: 0,
  },
  measureRow: {
    flexDirection: "row",
    gap: spacing.extraSmall,
    padding: spacing.extraSmall,
  },
  measureOption: {
    paddingHorizontal: spacing.extraSmall,
  },
});
