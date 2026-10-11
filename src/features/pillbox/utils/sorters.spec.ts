import type { Intake } from "@/domain/intake";
import type { Med } from "@/domain/med";

import { sortIntakeMeds, sortMeds } from "./sorters";

function createMed(name: string, strength: string): Med {
  return {
    id: `${name}-${strength}`,
    name,
    strength,
    design: { shape: "oval", color: "#FFFFFF", size: "medium" },
    isAsNeeded: false,
  };
}

function names(meds: Med[]): string[] {
  return meds.map(({ name, strength }) => `${name} ${strength}`);
}

describe("sortMeds", () => {
  it("sorts by name, ignoring accents and case", () => {
    const meds = [
      createMed("quviviq", "50 mg"),
      createMed("Prégabaline", "50 mg"),
      createMed("Lithium", "250 mg"),
    ];

    expect(names(sortMeds(meds))).toEqual(["Lithium 250 mg", "Prégabaline 50 mg", "quviviq 50 mg"]);
  });

  it("sorts by strength numerically when names are equal", () => {
    const meds = [createMed("Lamictal", "100 mg"), createMed("Lamictal", "50 mg")];

    expect(names(sortMeds(meds))).toEqual(["Lamictal 50 mg", "Lamictal 100 mg"]);
  });

  it("does not mutate the given list", () => {
    const meds = [createMed("Lithium", "250 mg"), createMed("Lamictal", "50 mg")];

    sortMeds(meds);

    expect(names(meds)).toEqual(["Lithium 250 mg", "Lamictal 50 mg"]);
  });
});

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

    expect(names(sortIntakeMeds(intake).medQuantities.map(({ med }) => med))).toEqual([
      "Lamictal 100 mg",
      "Quviviq 50 mg",
    ]);
  });
});
