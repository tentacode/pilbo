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
  button: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
    minHeight: sizes.buttonMinimumHeight,
    paddingHorizontal: spacing.buttonHorizontal,
    borderRadius: radius.round,
    borderWidth: borderWidth.selected,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },
  selected: {
    borderColor: colors.ink,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  wheel: {
    width: sizes.colorDot,
    height: sizes.colorDot,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: radius.round,
    borderWidth: borderWidth.thin,
    borderColor: colors.colorDotOutline,
  },
  center: {
    position: "absolute",
    width: sizes.colorWheelCenter,
    height: sizes.colorWheelCenter,
    borderRadius: radius.round,
    borderWidth: borderWidth.thin,
    borderColor: colors.colorDotOutline,
  },
  label: {
    flexShrink: 1,
  },
});
