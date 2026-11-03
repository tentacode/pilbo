import type { ColorValue } from "react-native";

import type { IconName } from "@/design-system/components/Icon/iconShapes";
import type { TextTone } from "@/design-system/components/Text/Text";
import { borderWidth, colors } from "@/design-system/tokens";
import { createThemedStyles } from "@/design-system/utils/createThemedStyles";

import type { DayStatus } from "@/features/calendar/utils/calendarTypes";

type HandledDayStatus = Exclude<DayStatus, "none">;

export const DAY_STATUS_APPEARANCES: Record<
  HandledDayStatus,
  { icon: IconName; tone: TextTone; color: ColorValue }
> = {
  taken: { icon: "check", tone: "success", color: colors.successInk },
  late: { icon: "clock", tone: "warning", color: colors.warningInk },
  missed: { icon: "alert", tone: "onAlert", color: colors.onAlert },
  skipped: { icon: "minus", tone: "secondary", color: colors.inkSecondary },
};

export const useDayStatusStyles = createThemedStyles((themeColors) => ({
  taken: { backgroundColor: themeColors.successChip },
  late: { backgroundColor: themeColors.warningChip },
  missed: { backgroundColor: themeColors.alertNotice },
  skipped: { borderStyle: "dashed", borderColor: themeColors.calendarSkipLine },
  none: {},
  today: { borderWidth: borderWidth.today, borderStyle: "solid", borderColor: themeColors.ink },
}));
