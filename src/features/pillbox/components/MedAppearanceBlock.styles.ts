import { StyleSheet } from "react-native";

import {
  borderWidth,
  colors,
  pressedOpacity,
  radius,
  sizes,
  spacing,
} from "@/design-system/tokens";

export const styles = StyleSheet.create({
  block: {
    alignItems: "center",
    gap: spacing.emptyStateGap,
    paddingTop: spacing.previewTop,
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.large,
    borderRadius: radius.largeCard,
    backgroundColor: colors.fill,
  },
  preview: {
    width: sizes.pillPreviewButton,
    height: sizes.pillPreviewButton,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  editBadge: {
    position: "absolute",
    right: spacing.tiny,
    bottom: spacing.tiny,
    width: sizes.iconBadge,
    height: sizes.iconBadge,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
    borderWidth: borderWidth.thick,
    borderColor: colors.fill,
    backgroundColor: colors.ink,
  },
  description: {
    textAlign: "center",
  },
});
