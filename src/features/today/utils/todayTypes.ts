import type { Intake } from "@/domain/intake";
import type { Med } from "@/domain/med";

export type IntakeStatus = "late" | "next" | "later" | "taken" | "skipped";

export type IntakeValidation = {
  time: Intake["time"];
  isTakenLate: boolean;
};

export type TodayIntake = {
  intake: Intake;
  status: IntakeStatus;
  minutesFromNow: number;
  validation?: IntakeValidation;
};

export type TodaySections = {
  late: TodayIntake[];
  next: TodayIntake | null;
  later: TodayIntake[];
  earlier: TodayIntake[];
};

export type FormattedText = {
  text: string;
  accessibilityLabel: string;
};

export type AsNeededMedOfDay = {
  med: Med;
  lastTakenAt?: string;
};
