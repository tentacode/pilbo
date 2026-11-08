import { StyleSheet } from "react-native";

import { createShadows } from "../../shadows";
import { borderWidth, radius, sizes } from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  track: {
    height: sizes.touchTarget,
    justifyContent: "center",
  },
  gradient: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.round,
    borderWidth: borderWidth.thin,
    borderColor: themeColors.sliderOutline,
    overflow: "hidden",
  },
  thumb: {
    ...createShadows(themeColors).raised,
    position: "absolute",
    width: sizes.sliderThumb,
    height: sizes.sliderThumb,
    borderRadius: radius.round,
    borderWidth: borderWidth.thick,
    borderColor: themeColors.surface,
    outlineWidth: borderWidth.regular,
    outlineColor: themeColors.ink,
  },
}));
