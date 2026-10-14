import { StyleSheet } from "react-native";

import { borderWidth, colors, radius, spacing } from "@/design-system/tokens";

export const styles = StyleSheet.create({
  card: {
    borderRadius: radius.largeCard,
    borderWidth: borderWidth.regular,
    paddingVertical: spacing.compactCardVertical,
    paddingHorizontal: spacing.large,
  },
  takenCard: {
    borderColor: colors.doneLine,
    backgroundColor: colors.doneBackground,
  },
  skippedCard: {
    borderStyle: "dashed",
    borderColor: colors.skipLine,
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
  stripPill: {
    marginLeft: spacing.pillStripOverlap,
  },
  names: {
    marginTop: spacing.compactNamesTop,
  },
});
