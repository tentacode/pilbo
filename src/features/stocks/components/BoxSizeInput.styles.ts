import { StyleSheet } from "react-native";

import {
  borderWidth,
  colors,
  fontFamily,
  fontSize,
  radius,
  sizes,
  spacing,
} from "@/design-system/tokens";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
  },
  input: {
    minWidth: sizes.boxSizeInputMinimumWidth,
    minHeight: sizes.touchTarget,
    paddingHorizontal: spacing.small,
    borderRadius: radius.segmentItem,
    borderWidth: borderWidth.regular,
    borderColor: colors.surface,
    backgroundColor: colors.surface,
    textAlign: "center",
    fontFamily: fontFamily.bold,
    fontSize: fontSize.body,
    fontVariant: ["tabular-nums"],
    color: colors.ink,
  },
  invalidInput: {
    borderColor: colors.alertInk,
  },
});
