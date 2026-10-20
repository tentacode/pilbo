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
  option: {
    flex: 1,
    minHeight: sizes.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.extraSmall,
    borderRadius: radius.segmentItem,
  },
  selectedOption: {
    ...shadow.raised,
    backgroundColor: colors.surface,
  },
  label: {
    textAlign: "center",
  },
});
