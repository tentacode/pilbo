import { formatIntakeTime, type Intake, sortIntakeMeds } from "./intake";
import type { Med } from "./med";

function createMed(name: string, strength: string): Med {
  return {
    id: `${name}-${strength}`,
    name,
    strength,
    design: { shape: "oval", color: "#FFFFFF", size: "medium" },
    isAsNeeded: false,
  };
}

describe("sortIntakeMeds", () => {
  it("sorts the meds of an intake", () => {
    const intake: Intake = {
      id: "night",
      time: { hour: 22, minute: 0 },
      days: ["monday"],
      reminderIntervalMinutes: 10,
      medQuantities: [
        { med: createMed("Quviviq", "50 mg"), quantity: 1 },
        { med: createMed("Lamictal", "100 mg"), quantity: 2 },
      ],
    };

    expect(
      sortIntakeMeds(intake).medQuantities.map(({ med }) => `${med.name} ${med.strength}`),
    ).toEqual(["Lamictal 100 mg", "Quviviq 50 mg"]);
  });
});

describe("formatIntakeTime", () => {
  it("pads the hour and the minute with zeros", () => {
    expect(formatIntakeTime({ hour: 8, minute: 5 })).toBe("08:05");
  });

  it("keeps two digit values", () => {
    expect(formatIntakeTime({ hour: 22, minute: 30 })).toBe("22:30");
  });
});
