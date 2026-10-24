import { StyleSheet, type ColorValue } from "react-native";

import type { IconName } from "@/design-system/components/Icon/iconShapes";
import type { TextTone } from "@/design-system/components/Text/Text";
import { borderWidth, colors } from "@/design-system/tokens";

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

export const dayStatusStyles = StyleSheet.create({
  taken: { backgroundColor: colors.successChip },
  late: { backgroundColor: colors.warningChip },
  missed: { backgroundColor: colors.alertNotice },
  skipped: { borderStyle: "dashed", borderColor: colors.calendarSkipLine },
  none: {},
  today: { borderWidth: borderWidth.today, borderStyle: "solid", borderColor: colors.ink },
});
