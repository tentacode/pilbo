import { borderWidth, pressedOpacity, radius, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  card: {
    borderRadius: radius.largeCard,
    borderWidth: borderWidth.regular,
    paddingVertical: spacing.compactCardVertical,
    paddingHorizontal: spacing.large,
  },
  takenCard: {
    borderColor: themeColors.doneLine,
    backgroundColor: themeColors.doneBackground,
  },
  skippedCard: {
    borderStyle: "dashed",
    borderColor: themeColors.skipLine,
  },
  head: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.medium,
  },
  heading: {
    flexShrink: 1,
  },
  time: {
    marginBottom: spacing.compactTimeBottom,
  },
  strip: {
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: {
    opacity: pressedOpacity,
  },
  chevron: {
    marginLeft: spacing.small,
  },
  stripPill: {
    marginLeft: spacing.pillStripOverlap,
  },
  names: {
    marginTop: spacing.compactNamesTop,
  },
}));
