import type { IntakeLog, IntakeLogStatus } from "@/domain/intakeLog";

import { computeDayStatus } from "./computeDayStatus";

const MORNING = { id: "morning", time: { hour: 8, minute: 20 } };
const EVENING = { id: "evening", time: { hour: 20, minute: 20 } };

function log(
  intakeId: string,
  status: IntakeLogStatus,
  createdAt: string,
  expected = "08:20",
): IntakeLog {
  return {
    id: `log-${intakeId}`,
    intakeId,
    expectedIntakeAt: `2026-10-20T${expected}`,
    createdAt: `2026-10-20T${createdAt}`,
    status,
  };
}

describe("computeDayStatus", () => {
  it("is none without planned intake", () => {
    expect(computeDayStatus([], [])).toBe("none");
  });

  it("is missed when no planned intake has an action", () => {
    expect(computeDayStatus([MORNING, EVENING], [])).toBe("missed");
  });

  it("is late when an intake was taken late, before the other statuses", () => {
    expect(
      computeDayStatus(
        [MORNING, EVENING],
        [log("morning", "taken", "09:35"), log("evening", "skipped", "20:20", "20:20")],
      ),
    ).toBe("late");
  });

  it("is taken when an intake was taken, others skipped or without action", () => {
    expect(computeDayStatus([MORNING, EVENING], [log("morning", "taken", "08:25")])).toBe("taken");
    expect(
      computeDayStatus(
        [MORNING, EVENING],
        [log("morning", "taken", "08:25"), log("evening", "skipped", "20:20", "20:20")],
      ),
    ).toBe("taken");
  });

  it("is skipped when every intake with an action was skipped", () => {
    expect(computeDayStatus([MORNING, EVENING], [log("morning", "skipped", "08:20")])).toBe(
      "skipped",
    );
  });

  it("ignores the logs of intakes that were not planned that day", () => {
    expect(computeDayStatus([EVENING], [log("morning", "taken", "08:25")])).toBe("missed");
  });

  describe("today", () => {
    it("is none while nothing is handled nor late", () => {
      expect(computeDayStatus([MORNING, EVENING], [], new Date(2026, 9, 20, 9, 0))).toBe("none");
    });

    it("is missed when an intake is late without action", () => {
      expect(computeDayStatus([MORNING, EVENING], [], new Date(2026, 9, 20, 9, 30))).toBe("missed");
    });

    it("only looks at the handled and late intakes", () => {
      expect(
        computeDayStatus(
          [MORNING, EVENING],
          [log("morning", "taken", "08:25")],
          new Date(2026, 9, 20, 9, 0),
        ),
      ).toBe("taken");
    });
  });
});
