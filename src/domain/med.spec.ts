import { compareMeds, formatMedLabel, type Med, PILL_SHAPES, sortMedQuantities } from "./med";

function createMed(name: string, strength: string): Med {
  return {
    id: `${name}-${strength}`,
    name,
    strength,
    detail: "",
    design: { shape: "oval", colors: ["#FFFFFF", "#FFFFFF"], size: "medium" },
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

  it("sorts by descending strength, numerically, when names are equal", () => {
    const meds = [
      createMed("Lamictal", "50 mg"),
      createMed("Lamictal", "25 mg"),
      createMed("Lamictal", "100 mg"),
    ];

    expect(names(meds.sort(compareMeds))).toEqual([
      "Lamictal 100 mg",
      "Lamictal 50 mg",
      "Lamictal 25 mg",
    ]);
  });

  it("compares decimal strengths written with a comma", () => {
    const meds = [createMed("Xanax", "0,25 mg"), createMed("Xanax", "0,5 mg")];

    expect(names(meds.sort(compareMeds))).toEqual(["Xanax 0,5 mg", "Xanax 0,25 mg"]);
  });

  it("compares decimal strengths written with a point", () => {
    const meds = [createMed("Xanax", "0.25 mg"), createMed("Xanax", "0.5 mg")];

    expect(names(meds.sort(compareMeds))).toEqual(["Xanax 0.5 mg", "Xanax 0.25 mg"]);
  });

  it("compares decimal strengths mixing commas, points and integers", () => {
    const meds = [
      createMed("Lysanxia", "2,5 mg"),
      createMed("Lysanxia", "10 mg"),
      createMed("Lysanxia", "2.75 mg"),
    ];

    expect(names(meds.sort(compareMeds))).toEqual([
      "Lysanxia 10 mg",
      "Lysanxia 2.75 mg",
      "Lysanxia 2,5 mg",
    ]);
  });

  it("puts the med without strength last", () => {
    const meds = [createMed("Doliprane", ""), createMed("Doliprane", "500 mg")];

    expect(names(meds.sort(compareMeds))).toEqual(["Doliprane 500 mg", "Doliprane "]);
  });
});

describe("sortMedQuantities", () => {
  it("returns a sorted copy without mutating the given list", () => {
    const medQuantities = [
      { med: createMed("Lithium", "250 mg"), quantity: 1 },
      { med: createMed("Lamictal", "50 mg"), quantity: 2 },
    ];

    expect(names(sortMedQuantities(medQuantities).map(({ med }) => med))).toEqual([
      "Lamictal 50 mg",
      "Lithium 250 mg",
    ]);
    expect(names(medQuantities.map(({ med }) => med))).toEqual([
      "Lithium 250 mg",
      "Lamictal 50 mg",
    ]);
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
    expect(PILL_SHAPES.triangle.hasScoreLine).toBe(false);
    expect(PILL_SHAPES.square.hasScoreLine).toBe(false);
  });
});
