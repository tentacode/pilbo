import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, shadow, sizes } from "../../tokens";

export const styles = StyleSheet.create({
  track: {
    height: sizes.touchTarget,
    justifyContent: "center",
  },
  gradient: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.round,
    borderWidth: borderWidth.thin,
    borderColor: colors.sliderOutline,
    overflow: "hidden",
  },
  thumb: {
    ...shadow.raised,
    position: "absolute",
    width: sizes.sliderThumb,
    height: sizes.sliderThumb,
    borderRadius: radius.round,
    borderWidth: borderWidth.thick,
    borderColor: colors.surface,
    outlineWidth: borderWidth.regular,
    outlineColor: colors.ink,
  },
});
