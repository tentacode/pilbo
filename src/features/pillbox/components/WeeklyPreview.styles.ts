import { borderWidth, radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
  },
  weekday: {
    flex: 1,
    textAlign: "center",
  },
  week: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: sizes.weekPreviewRowMinimumHeight,
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: spacing.medium,
    borderTopWidth: borderWidth.regular,
    borderTopColor: themeColors.separator,
  },
  pausedWeek: {
    backgroundColor: themeColors.separator,
  },
  label: {
    width: sizes.weekPreviewLabelWidth,
  },
  slot: {
    flex: 1,
    alignItems: "center",
  },
  day: {
    minWidth: sizes.weekPreviewDay,
    minHeight: sizes.weekPreviewDay,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
  },
  dueDay: {
    backgroundColor: themeColors.ink,
  },
  dayNumber: {
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
}));
