import type { Intake } from "@/domain/intake";
import { addDays } from "@/domain/intakeLog";

import { createIntake, createIntakeLog } from "@/features/today/utils/testIntakes";
import { type IntakeDay, planIntakeDays } from "./planIntakeDays";
import { type PlannedReminder, planReminders } from "./planReminders";

const MORNING = createIntake(8, 20);
const NOON = createIntake(12, 20);

function at(day: number, hour: number, minute: number, second = 0): Date {
  return new Date(2026, 9, day, hour, minute, second);
}

function consecutiveDays(now: Date, ...intakesOfDays: Intake[][]): IntakeDay[] {
  return intakesOfDays.map((intakes, index) => ({ day: addDays(now, index), intakes }));
}

function lowStockAlert(date: Date): PlannedReminder {
  return {
    identifier: `low-stock-${date.getDate()}`,
    date,
    title: "Stock bas",
    body: "Lithium 250 mg : pensez à le renouveler.",
    interruptionLevel: "active",
    sound: "beep",
    channelId: "low-stock",
  };
}

function label(date: Date): string {
  const time = [date.getHours(), date.getMinutes()]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
  return `${date.getDate()} ${time}`;
}

function times(reminders: ReturnType<typeof planReminders>): string[] {
  return reminders.map(({ date }) => label(date));
}

describe("planReminders", () => {
  it("plans six reminders per intake, every reminder interval", () => {
    const reminders = planReminders({
      intakeDays: consecutiveDays(at(4, 7, 0), [MORNING]),
      todayLogs: [],
      now: at(4, 7, 0),
    });

    expect(times(reminders)).toEqual([
      "4 08:20",
      "4 08:30",
      "4 08:40",
      "4 08:50",
      "4 09:00",
      "4 09:10",
    ]);
  });

  it("keeps only the remaining reminders of a started intake", () => {
    const reminders = planReminders({
      intakeDays: consecutiveDays(at(4, 8, 35), [MORNING]),
      todayLogs: [],
      now: at(4, 8, 35),
    });

    expect(times(reminders)).toEqual(["4 08:40", "4 08:50", "4 09:00", "4 09:10"]);
  });

  it("keeps a reminder planned a few seconds later", () => {
    const reminders = planReminders({
      intakeDays: consecutiveDays(at(4, 8, 39, 50), [MORNING]),
      todayLogs: [],
      now: at(4, 8, 39, 50),
    });

    expect(times(reminders)[0]).toBe("4 08:40");
  });

  it("skips a reminder planned right now", () => {
    const reminders = planReminders({
      intakeDays: consecutiveDays(at(4, 8, 40), [MORNING]),
      todayLogs: [],
      now: at(4, 8, 40),
    });

    expect(times(reminders)[0]).toBe("4 08:50");
  });

  it("plans nothing for a handled intake", () => {
    const reminders = planReminders({
      intakeDays: consecutiveDays(at(4, 8, 30), [MORNING, NOON]),
      todayLogs: [createIntakeLog(MORNING, "skipped", { hour: 8, minute: 25 })],
      now: at(4, 8, 30),
    });

    expect(reminders.every(({ identifier }) => identifier.includes(NOON.id))).toBe(true);
    expect(reminders).toHaveLength(6);
  });

  it("adds the reminders of tomorrow", () => {
    const reminders = planReminders({
      intakeDays: consecutiveDays(at(4, 23, 0), [MORNING], [MORNING]),
      todayLogs: [],
      now: at(4, 23, 0),
    });

    expect(times(reminders)).toEqual([
      "5 08:20",
      "5 08:30",
      "5 08:40",
      "5 08:50",
      "5 09:00",
      "5 09:10",
    ]);
  });

  it("adds the intakes of the next days only while all their reminders fit in 63", () => {
    const now = at(4, 6, 0);
    const todayIntakes = Array.from({ length: 10 }, (_, index) => createIntake(10 + index, 0));

    const reminders = planReminders({
      intakeDays: consecutiveDays(now, todayIntakes, [createIntake(7, 0), createIntake(8, 0)]),
      todayLogs: [],
      now,
    });

    expect(reminders).toHaveLength(60);
    expect(reminders.filter(({ date }) => date.getDate() === 5)).toHaveLength(0);
  });

  it("never plans more than 63 reminders, keeping a slot for the reopen app warning", () => {
    const now = at(4, 6, 0);
    const todayIntakes = Array.from({ length: 12 }, (_, index) => createIntake(10 + index, 0));

    const reminders = planReminders({
      intakeDays: consecutiveDays(now, todayIntakes),
      todayLogs: [],
      now,
    });

    expect(reminders).toHaveLength(63);
  });

  it("plans ten days of a single daily intake", () => {
    const now = at(4, 7, 0);

    const reminders = planReminders({
      intakeDays: planIntakeDays([MORNING], now),
      todayLogs: [],
      now,
    });

    expect(reminders).toHaveLength(60);
    expect([...new Set(reminders.map(({ date }) => date.getDate()))]).toEqual([
      4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
    ]);
  });

  it("stops at the first intake whose reminders do not fit, without trying the next ones", () => {
    const now = at(4, 6, 0);
    const todayIntakes = Array.from({ length: 10 }, (_, index) => createIntake(10 + index, 0));

    const reminders = planReminders({
      intakeDays: consecutiveDays(now, todayIntakes, [MORNING]),
      todayLogs: [],
      lowStockAlerts: [lowStockAlert(at(6, 9, 0))],
      now,
    });

    expect(reminders).toHaveLength(60);
    expect(reminders.every(({ date }) => date.getDate() === 4)).toBe(true);
  });

  it("plans an intake due in three weeks", () => {
    const now = at(4, 7, 0);
    const monthly = {
      ...MORNING,
      frequency: "monthly" as const,
      startsOn: "2026-09-25",
      days: [],
    };

    const reminders = planReminders({
      intakeDays: planIntakeDays([monthly], now),
      todayLogs: [],
      now,
    });

    expect(times(reminders).slice(0, 2)).toEqual(["25 08:20", "25 08:30"]);
    expect(reminders[6].identifier).toBe("reminder-intake-8-20-2026-11-25T08:20");
  });

  it("plans the low stock alerts in chronological order with the reminders", () => {
    const now = at(4, 6, 0);
    const alert = lowStockAlert(at(5, 9, 0));

    const reminders = planReminders({
      intakeDays: consecutiveDays(now, [NOON], [MORNING], [NOON]),
      todayLogs: [],
      lowStockAlerts: [alert],
      now,
    });

    expect(reminders.map(({ identifier }) => identifier.slice(0, 9))).toEqual([
      ...Array<string>(12).fill("reminder-"),
      "low-stock",
      ...Array<string>(6).fill("reminder-"),
    ]);
    expect(reminders[12]).toBe(alert);
  });

  it("skips the low stock alerts after the last planned intake", () => {
    const now = at(4, 7, 0);

    const reminders = planReminders({
      intakeDays: planIntakeDays([MORNING], now),
      todayLogs: [],
      lowStockAlerts: [lowStockAlert(at(8, 9, 0)), lowStockAlert(at(20, 9, 0))],
      now,
    });

    expect(reminders).toHaveLength(61);
    expect(reminders.filter(({ title }) => title === "Stock bas")).toEqual([
      expect.objectContaining({ identifier: "low-stock-8" }),
    ]);
  });

  it("gives up the last intake when low stock alerts take its slots", () => {
    const now = at(4, 7, 0);
    const lowStockAlerts = [5, 6, 7, 8].map((day) => lowStockAlert(at(day, 9, 30)));

    const reminders = planReminders({
      intakeDays: planIntakeDays([MORNING], now),
      todayLogs: [],
      lowStockAlerts,
      now,
    });

    expect(reminders).toHaveLength(58);
    expect(Math.max(...reminders.map(({ date }) => date.getDate()))).toBe(12);
  });

  it("skips the low stock alerts after the one year horizon", () => {
    const now = at(4, 7, 0);

    const reminders = planReminders({
      intakeDays: [],
      todayLogs: [],
      lowStockAlerts: [
        lowStockAlert(new Date(2027, 9, 4, 9, 0)),
        lowStockAlert(new Date(2027, 9, 5, 9, 0)),
      ],
      now,
    });

    expect(reminders.map(({ date }) => date)).toEqual([new Date(2027, 9, 4, 9, 0)]);
  });

  it("keeps the local time across a change of time", () => {
    const now = at(24, 7, 0);

    const reminders = planReminders({
      intakeDays: planIntakeDays([MORNING], now),
      todayLogs: [],
      now,
    });

    expect(times(reminders).filter((time) => time.endsWith("08:20"))).toEqual([
      "24 08:20",
      "25 08:20",
      "26 08:20",
      "27 08:20",
      "28 08:20",
      "29 08:20",
      "30 08:20",
      "31 08:20",
      "1 08:20",
      "2 08:20",
    ]);
    expect(reminders[6].identifier).toBe("reminder-intake-8-20-2026-10-25T08:20");
  });

  it("plans the next days when nothing is due today", () => {
    const now = at(4, 7, 0);

    const reminders = planReminders({
      intakeDays: [{ day: addDays(now, 2), intakes: [MORNING] }],
      todayLogs: [],
      now,
    });

    expect(times(reminders)[0]).toBe("6 08:20");
    expect(reminders).toHaveLength(6);
  });

  it("counts the pending intakes of the day in the badge", () => {
    const evening = createIntake(8, 40);

    const reminders = planReminders({
      intakeDays: consecutiveDays(at(4, 7, 0), [MORNING, evening], [MORNING]),
      todayLogs: [],
      now: at(4, 7, 0),
    });

    expect(reminders.map(({ date, badge }) => [label(date), badge])).toEqual([
      ["4 08:20", 1],
      ["4 08:30", 1],
      ["4 08:40", 2],
      ["4 08:50", 2],
      ["4 09:00", 2],
      ["4 09:10", 2],
      ["4 08:40", 2],
      ["4 08:50", 2],
      ["4 09:00", 2],
      ["4 09:10", 2],
      ["4 09:20", 2],
      ["4 09:30", 2],
      ["5 08:20", 1],
      ["5 08:30", 1],
      ["5 08:40", 1],
      ["5 08:50", 1],
      ["5 09:00", 1],
      ["5 09:10", 1],
    ]);
  });

  it("does not count a handled intake in the badge", () => {
    const reminders = planReminders({
      intakeDays: consecutiveDays(at(4, 9, 0), [MORNING, NOON]),
      todayLogs: [createIntakeLog(MORNING, "taken", { hour: 8, minute: 30 })],
      now: at(4, 9, 0),
    });

    expect(reminders.map(({ badge }) => badge)).toEqual([1, 1, 1, 1, 1, 1]);
  });

  it("groups the reminders of an intake by day", () => {
    const reminders = planReminders({
      intakeDays: consecutiveDays(at(4, 7, 0), [MORNING, NOON], [MORNING]),
      todayLogs: [],
      now: at(4, 7, 0),
    });

    expect([...new Set(reminders.map(({ presentationGroup }) => presentationGroup))]).toEqual([
      "reminder-intake-8-20-2026-10-04",
      "reminder-intake-12-20-2026-10-04",
      "reminder-intake-8-20-2026-10-05",
    ]);
    expect(
      reminders.filter(({ presentationGroup }) => presentationGroup?.endsWith("8-20-2026-10-04")),
    ).toHaveLength(6);
  });

  it("writes the identifier, the title and the body", () => {
    const [reminder] = planReminders({
      intakeDays: consecutiveDays(at(4, 7, 0), [MORNING]),
      todayLogs: [],
      now: at(4, 7, 0),
    });

    expect(reminder).toEqual({
      identifier: "reminder-intake-8-20-2026-10-04T08:20",
      date: at(4, 8, 20),
      title: "C'est l'heure de votre prise de 08:20",
      body: "1 × Lithium 250 mg",
      badge: 1,
      presentationGroup: "reminder-intake-8-20-2026-10-04",
      reminderIntake: { intakeId: "intake-8-20", intakeDay: "2026-10-04" },
      interruptionLevel: "timeSensitive",
      sound: "beep",
      channelId: "intake-reminders",
    });
  });

  it("uses the sound of the intake and its channel", () => {
    const [reminder] = planReminders({
      intakeDays: consecutiveDays(at(4, 7, 0), [{ ...MORNING, sound: "chime" }]),
      todayLogs: [],
      now: at(4, 7, 0),
    });

    expect(reminder).toMatchObject({ sound: "chime", channelId: "intake-reminders-chime" });
  });
});
