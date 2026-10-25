import { createIntake, createIntakeLog } from "@/features/today/utils/testIntakes";

import { planReminders } from "./planReminders";

const MORNING = createIntake(8, 20);
const NOON = createIntake(12, 20);

function at(day: number, hour: number, minute: number, second = 0): Date {
  return new Date(2026, 9, day, hour, minute, second);
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
      todayIntakes: [MORNING],
      tomorrowIntakes: [],
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
      todayIntakes: [MORNING],
      tomorrowIntakes: [],
      todayLogs: [],
      now: at(4, 8, 35),
    });

    expect(times(reminders)).toEqual(["4 08:40", "4 08:50", "4 09:00", "4 09:10"]);
  });

  it("keeps a reminder planned a few seconds later", () => {
    const reminders = planReminders({
      todayIntakes: [MORNING],
      tomorrowIntakes: [],
      todayLogs: [],
      now: at(4, 8, 39, 50),
    });

    expect(times(reminders)[0]).toBe("4 08:40");
  });

  it("skips a reminder planned right now", () => {
    const reminders = planReminders({
      todayIntakes: [MORNING],
      tomorrowIntakes: [],
      todayLogs: [],
      now: at(4, 8, 40),
    });

    expect(times(reminders)[0]).toBe("4 08:50");
  });

  it("plans nothing for a handled intake", () => {
    const reminders = planReminders({
      todayIntakes: [MORNING, NOON],
      tomorrowIntakes: [],
      todayLogs: [createIntakeLog(MORNING, "skipped", { hour: 8, minute: 25 })],
      now: at(4, 8, 30),
    });

    expect(reminders.every(({ identifier }) => identifier.includes(NOON.id))).toBe(true);
    expect(reminders).toHaveLength(6);
  });

  it("adds the reminders of tomorrow", () => {
    const reminders = planReminders({
      todayIntakes: [MORNING],
      tomorrowIntakes: [MORNING],
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

  it("adds the intakes of tomorrow only while all their reminders fit in 64", () => {
    const todayIntakes = Array.from({ length: 10 }, (_, index) => createIntake(10 + index, 0));
    const tomorrowIntakes = [createIntake(7, 0), createIntake(8, 0)];

    const reminders = planReminders({
      todayIntakes,
      tomorrowIntakes,
      todayLogs: [],
      now: at(4, 6, 0),
    });

    expect(reminders).toHaveLength(60);
    expect(reminders.filter(({ date }) => date.getDate() === 5)).toHaveLength(0);
  });

  it("never plans more than 64 reminders", () => {
    const todayIntakes = Array.from({ length: 12 }, (_, index) => createIntake(10 + index, 0));

    const reminders = planReminders({
      todayIntakes,
      tomorrowIntakes: [],
      todayLogs: [],
      now: at(4, 6, 0),
    });

    expect(reminders).toHaveLength(64);
  });

  it("plans the low stock alerts after today and before tomorrow", () => {
    const alert = {
      identifier: "low-stock-2026-10-08",
      date: at(8, 9, 0),
      title: "Stock bas",
      body: "Lithium 250 mg : pensez à le renouveler.",
      interruptionLevel: "active" as const,
    };

    const reminders = planReminders({
      todayIntakes: [NOON],
      tomorrowIntakes: [MORNING],
      todayLogs: [],
      lowStockAlerts: [alert],
      now: at(4, 6, 0),
    });

    expect(reminders.map(({ identifier }) => identifier.slice(0, 9))).toEqual([
      ...Array<string>(6).fill("reminder-"),
      "low-stock",
      ...Array<string>(6).fill("reminder-"),
    ]);
    expect(reminders[6]).toBe(alert);
  });

  it("keeps the low stock alerts before tomorrow within 64", () => {
    const todayIntakes = Array.from({ length: 10 }, (_, index) => createIntake(10 + index, 0));
    const lowStockAlerts = Array.from({ length: 6 }, (_, index) => ({
      identifier: `low-stock-${index}`,
      date: at(10 + index, 9, 0),
      title: "Stock bas",
      body: "",
      interruptionLevel: "active" as const,
    }));

    const reminders = planReminders({
      todayIntakes,
      tomorrowIntakes: [MORNING],
      todayLogs: [],
      lowStockAlerts,
      now: at(4, 6, 0),
    });

    expect(reminders).toHaveLength(64);
    expect(reminders.filter(({ title }) => title === "Stock bas")).toHaveLength(4);
    expect(reminders.filter(({ date }) => date.getDate() === 5)).toHaveLength(0);
  });

  it("counts the pending intakes of the day in the badge", () => {
    const evening = createIntake(8, 40);

    const reminders = planReminders({
      todayIntakes: [MORNING, evening],
      tomorrowIntakes: [MORNING],
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
      todayIntakes: [MORNING, NOON],
      tomorrowIntakes: [],
      todayLogs: [createIntakeLog(MORNING, "taken", { hour: 8, minute: 30 })],
      now: at(4, 9, 0),
    });

    expect(reminders.map(({ badge }) => badge)).toEqual([1, 1, 1, 1, 1, 1]);
  });

  it("writes the identifier, the title and the body", () => {
    const [reminder] = planReminders({
      todayIntakes: [MORNING],
      tomorrowIntakes: [],
      todayLogs: [],
      now: at(4, 7, 0),
    });

    expect(reminder).toEqual({
      identifier: "reminder-intake-8-20-2026-10-04T08:20",
      date: at(4, 8, 20),
      title: "C'est l'heure de votre prise de 08:20",
      body: "1 × Lithium 250 mg",
      badge: 1,
      interruptionLevel: "timeSensitive",
    });
  });
});
