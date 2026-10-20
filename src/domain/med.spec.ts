import { compareMeds, formatMedLabel, type Med, PILL_SHAPES } from "./med";

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

describe("formatMedLabel", () => {
  it("joins the name and the strength", () => {
    expect(formatMedLabel(createMed("Lithium", "250 mg"))).toBe("Lithium 250 mg");
  });

  it("returns the name alone without strength", () => {
    expect(formatMedLabel(createMed("Lithium", ""))).toBe("Lithium");
  });
});

describe("PILL_SHAPES", () => {
  it("gives a score line to the round and oval shapes", () => {
    expect(PILL_SHAPES.round.hasScoreLine).toBe(true);
    expect(PILL_SHAPES.oval.hasScoreLine).toBe(true);
    expect(PILL_SHAPES.capsule.hasScoreLine).toBe(false);
    expect(PILL_SHAPES.softgel.hasScoreLine).toBe(false);
  });
});
