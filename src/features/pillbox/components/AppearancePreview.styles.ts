import { StyleSheet } from "react-native";

import { colors, radius, sizes, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  preview: {
    alignItems: "center",
    gap: spacing.medium,
    paddingTop: spacing.large,
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.previewBottom,
    borderRadius: radius.largeCard,
    backgroundColor: colors.fill,
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.medium,
    paddingVertical: spacing.previewRowVertical,
    paddingHorizontal: spacing.previewRowHorizontal,
    borderRadius: radius.previewRow,
    backgroundColor: colors.surface,
  },
  texts: {
    flex: 1,
    gap: spacing.tiny,
  },
  largePill: {
    width: sizes.pillPreviewLarge,
    height: sizes.pillPreviewLarge,
  },
});
