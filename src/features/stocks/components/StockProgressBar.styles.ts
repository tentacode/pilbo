import { StyleSheet } from "react-native";

import { colors, radius, sizes } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  track: {
    height: sizes.progressBarHeight,
    borderRadius: radius.round,
    backgroundColor: colors.progressTrack,
    overflow: "hidden",
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
