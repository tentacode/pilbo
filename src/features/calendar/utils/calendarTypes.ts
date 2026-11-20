import type { Intake, IntakeRecurrence } from "@/domain/intake";

export type DayStatus = "missed" | "late" | "taken" | "skipped" | "none";

export type Month = {
  year: number;
  month: number;
};

export type IntakeVersion = IntakeRecurrence & {
  id: string;
  time: Intake["time"];
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
