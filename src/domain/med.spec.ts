import { compareMeds, type Med } from "./med";

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

describe("compareMeds", () => {
  it("sorts by name, ignoring accents and case", () => {
    const meds = [
      createMed("quviviq", "50 mg"),
      createMed("Prégabaline", "50 mg"),
      createMed("Lithium", "250 mg"),
    ];

    expect(names(meds.sort(compareMeds))).toEqual([
      "Lithium 250 mg",
      "Prégabaline 50 mg",
      "quviviq 50 mg",
    ]);
  });

  it("sorts by strength numerically when names are equal", () => {
    const meds = [createMed("Lamictal", "100 mg"), createMed("Lamictal", "50 mg")];

    expect(names(meds.sort(compareMeds))).toEqual(["Lamictal 50 mg", "Lamictal 100 mg"]);
  });
});
