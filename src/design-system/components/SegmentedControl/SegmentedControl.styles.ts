import { createShadows, radius, sizes, spacing } from "../../tokens";
import { createThemedStyles } from "../../utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  control: {
    flexDirection: "row",
    gap: spacing.extraSmall,
    padding: spacing.extraSmall,
    borderRadius: radius.segment,
    backgroundColor: themeColors.fill,
  },
  stackedControl: {
    flexDirection: "column",
  },
  option: {
    flex: 1,
    minHeight: sizes.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.extraSmall,
    borderRadius: radius.segmentItem,
  },
  stackedOption: {
    flex: 0,
    paddingVertical: spacing.small,
  },
  selectedOption: {
    ...createShadows(themeColors).raised,
    backgroundColor: themeColors.surface,
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
  measureRow: {
    flexDirection: "row",
    gap: spacing.extraSmall,
    padding: spacing.extraSmall,
  },
  measureOption: {
    paddingHorizontal: spacing.extraSmall,
  },
}));
