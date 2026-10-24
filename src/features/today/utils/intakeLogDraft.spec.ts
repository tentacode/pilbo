import type { Intake } from "@/domain/intake";
import type { IntakeLog } from "@/domain/intakeLog";

import { createIntakeLogDraft, isIntakeLogDraftDirty } from "./intakeLogDraft";

const intake: Intake = {
  id: "intake",
  time: { hour: 8, minute: 0 },
  days: ["monday"],
  reminderIntervalMinutes: 10,
  medQuantities: [],
};

function logOf(status: IntakeLog["status"]): IntakeLog {
  return {
    id: "log",
    intakeId: intake.id,
    expectedIntakeAt: "2026-10-14T08:00",
    createdAt: "2026-10-14T09:25",
    status,
  };
}

describe("createIntakeLogDraft", () => {
  it("starts on the scheduled time without log", () => {
    expect(createIntakeLogDraft(intake)).toEqual({
      status: "none",
      takenTime: { hour: 8, minute: 0 },
    });
  });

  it("starts on the recorded time of a taken intake", () => {
    expect(createIntakeLogDraft(intake, logOf("taken"))).toEqual({
      status: "taken",
      takenTime: { hour: 9, minute: 25 },
    });
  });

  it("starts on the scheduled time of a skipped intake", () => {
    expect(createIntakeLogDraft(intake, logOf("skipped"))).toEqual({
      status: "skipped",
      takenTime: { hour: 8, minute: 0 },
    });
  });
});

describe("isIntakeLogDraftDirty", () => {
  const initialDraft = createIntakeLogDraft(intake, logOf("taken"));

  it("is clean when nothing changed", () => {
    expect(isIntakeLogDraftDirty(initialDraft, initialDraft)).toBe(false);
  });

  it("is dirty when the status or the taken time changed", () => {
    expect(isIntakeLogDraftDirty({ ...initialDraft, status: "skipped" }, initialDraft)).toBe(true);
    expect(
      isIntakeLogDraftDirty({ ...initialDraft, takenTime: { hour: 9, minute: 30 } }, initialDraft),
    ).toBe(true);
  });

  it("ignores the time when the intake is not taken", () => {
    const skippedDraft = createIntakeLogDraft(intake, logOf("skipped"));

    expect(
      isIntakeLogDraftDirty({ ...skippedDraft, takenTime: { hour: 9, minute: 30 } }, skippedDraft),
    ).toBe(false);
  });
});
