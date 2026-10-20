import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, shadow, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.emptyStateGap,
    minHeight: sizes.halfOptionMinimumHeight,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.extraSmall,
    borderRadius: radius.segmentItem,
  },
  selected: {
    ...shadow.raised,
    backgroundColor: colors.surface,
  },
  dot: {
    width: sizes.colorDot,
    height: sizes.colorDot,
    borderRadius: radius.round,
    borderWidth: borderWidth.thin,
    borderColor: colors.colorDotOutline,
  },
  label: {
    flexShrink: 1,
  },
});
