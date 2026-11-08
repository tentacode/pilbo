import type { IconName } from "@/design-system/components/Icon/iconShapes";
import type { TextTone } from "@/design-system/components/Text/Text";
import { borderWidth, type ColorName } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

import type { DayStatus } from "@/features/calendar/utils/calendarTypes";

type HandledDayStatus = Exclude<DayStatus, "none">;

export const DAY_STATUS_APPEARANCES: Record<
  HandledDayStatus,
  { icon: IconName; tone: TextTone; color: ColorName }
> = {
  taken: { icon: "check", tone: "success", color: "successInk" },
  late: { icon: "clock", tone: "warning", color: "warningInk" },
  missed: { icon: "alert", tone: "onCalendarMissed", color: "onCalendarMissed" },
  skipped: { icon: "minus", tone: "secondary", color: "inkSecondary" },
};

export const useDayStatusStyles = createThemedStyles((themeColors) => ({
  taken: { backgroundColor: themeColors.successChip },
  late: { backgroundColor: themeColors.warningChip },
  missed: { backgroundColor: themeColors.calendarMissed },
  skipped: { borderStyle: "dashed", borderColor: themeColors.calendarSkipLine },
  none: {},
  today: { borderWidth: borderWidth.today, borderStyle: "solid", borderColor: themeColors.ink },
}));
