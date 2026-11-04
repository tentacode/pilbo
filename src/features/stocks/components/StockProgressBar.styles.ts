import { StyleSheet } from "react-native";

import { colors, radius, sizes } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  track: {
    height: sizes.progressBarHeight,
    borderRadius: radius.round,
    backgroundColor: colors.progressTrack,
    overflow: "hidden",
  },
  compactTrack: {
    width: sizes.compactProgressBarWidth,
    height: sizes.compactProgressBarHeight,
  },
  lowTrack: {
    backgroundColor: colors.surface,
  },
  fill: {
    height: "100%",
    borderRadius: radius.round,
    backgroundColor: colors.inkSecondary,
  },
  lowFill: {
    backgroundColor: colors.alertInk,
  },
});
