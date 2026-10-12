import type { Intake } from "@/domain/intake";

export type IntakeStatus = "late" | "next" | "later";

export type TodayIntake = {
  intake: Intake;
  status: IntakeStatus;
  minutesFromNow: number;
};

export type TodaySections = {
  late: TodayIntake[];
  next: TodayIntake | null;
  later: TodayIntake[];
};

export type TodaySummary = {
  progress: string;
  detail: string;
  accessibilityLabel: string;
};

export type FormattedText = {
  text: string;
  accessibilityLabel: string;
};
