import type { Intake } from "@/domain/intake";

import { createIntake, createIntakeLog } from "@/features/today/utils/testIntakes";
import { nextIntakeDatesOf } from "./nextIntakes";

const SUNDAY = new Date(2026, 9, 4, 7, 0);

const everyOtherSunday: Intake = {
  ...createIntake(8, 0),
  frequency: "weekly",
  interval: 2,
  startsOn: "2026-10-04",
  days: ["sunday"],
};

describe("nextIntakeDatesOf", () => {
  it("returns today for a due intake without log", () => {
    expect(nextIntakeDatesOf([everyOtherSunday], [], SUNDAY).get(everyOtherSunday.id)).toEqual(
      new Date(2026, 9, 4),
    );
  });

  it("skips today once the intake is handled", () => {
    const logs = [createIntakeLog(everyOtherSunday, "taken", { hour: 8, minute: 5 })];

    expect(nextIntakeDatesOf([everyOtherSunday], logs, SUNDAY).get(everyOtherSunday.id)).toEqual(
      new Date(2026, 9, 18),
    );
  });

  it("ignores every day intakes", () => {
    const intake = createIntake(8, 0);

    expect(nextIntakeDatesOf([intake], [], SUNDAY).has(intake.id)).toBe(false);
  });
});
