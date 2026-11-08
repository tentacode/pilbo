import { radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: spacing.legendRowGap,
    marginTop: spacing.calendarLegendTop,
    paddingVertical: spacing.legendVertical,
    paddingHorizontal: spacing.large,
    borderRadius: radius.legend,
    backgroundColor: themeColors.fill,
  },
  halfCell: {
    width: "50%",
    paddingRight: spacing.legendColumnGap,
  },
  fullCell: {
    width: "100%",
  },
  measureContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: sizes.unconstrainedMeasureWidth,
    flexDirection: "row",
    alignItems: "flex-start",
    opacity: 0,
  },
}));
