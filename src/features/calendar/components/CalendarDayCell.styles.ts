import { borderWidth, pressedOpacity, radius, sizes, spacing } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

export const useStyles = createThemedStyles((themeColors) => ({
  cell: {
    flexGrow: 1,
    minHeight: sizes.calendarDayMinimumHeight,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.tiny,
    borderRadius: radius.calendarDay,
    borderWidth: borderWidth.regular,
    borderColor: "transparent",
  },
  pressed: {
    opacity: pressedOpacity,
  },
  number: {
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
}));
