import { type Intake, intakeDateOn, sortIntakeMeds } from "./intake";
import type { Med } from "./med";

function createMed(name: string, strength: string): Med {
  return {
    id: `${name}-${strength}`,
    name,
    strength,
    detail: "",
    design: { shape: "oval", colors: ["#FFFFFF", "#FFFFFF"], size: "medium" },
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

describe("intakeDateOn", () => {
  it("places the intake time on the given day", () => {
    expect(intakeDateOn(new Date(2026, 9, 14, 23, 59), { hour: 8, minute: 20 })).toEqual(
      new Date(2026, 9, 14, 8, 20),
    );
  });
});
