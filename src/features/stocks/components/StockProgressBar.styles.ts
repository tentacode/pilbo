import { radius, sizes } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  track: {
    height: sizes.progressBarHeight,
    borderRadius: radius.round,
    backgroundColor: themeColors.progressTrack,
    overflow: "hidden",
  },
  compactTrack: {
    width: sizes.compactProgressBarWidth,
    height: sizes.compactProgressBarHeight,
  },
  lowTrack: {
    backgroundColor: themeColors.surface,
  },
  fill: {
    height: "100%",
    borderRadius: radius.round,
    backgroundColor: themeColors.inkSecondary,
  },
  lowFill: {
    backgroundColor: themeColors.alertInk,
  },
}));
