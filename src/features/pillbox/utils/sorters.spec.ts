import type { Med } from "@/domain/med";

import { sortMeds } from "./sorters";

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

function names(meds: Med[]): string[] {
  return meds.map(({ name, strength }) => `${name} ${strength}`);
}

describe("sortMeds", () => {
  it("returns the meds sorted by name then strength", () => {
    const meds = [createMed("Lithium", "250 mg"), createMed("Lamictal", "100 mg")];

    expect(names(sortMeds(meds))).toEqual(["Lamictal 100 mg", "Lithium 250 mg"]);
  });

  it("does not mutate the given list", () => {
    const meds = [createMed("Lithium", "250 mg"), createMed("Lamictal", "50 mg")];

    sortMeds(meds);

    expect(names(meds)).toEqual(["Lithium 250 mg", "Lamictal 50 mg"]);
  });
});
