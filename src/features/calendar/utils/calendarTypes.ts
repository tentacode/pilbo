import type { Intake, Weekday } from "@/domain/intake";

export type DayStatus = "missed" | "late" | "taken" | "skipped" | "none";

export type Month = {
  year: number;
  month: number;
};

export type IntakeVersion = {
  id: string;
  time: Intake["time"];
  days: Weekday[];
  createdOn: string;
  archivedOn: string | null;
};

export type CalendarDay = {
  localDate: string;
  dayOfMonth: number;
  status: DayStatus;
  isToday: boolean;
  isSelectable: boolean;
};
