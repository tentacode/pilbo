import type { Med } from "@/domain/med";

import { createMedDraft, DEFAULT_PILL_DESIGN, toMedValues } from "./medDraft";
import { validateMedDraft } from "./validators";

const LITHIUM: Med = {
  id: "lithium",
  name: "Lithium",
  strength: "250 mg",
  detail: "Avec le repas",
  design: { shape: "round", colors: ["#D6C9F5", "#D6C9F5"], size: "medium" },
  isAsNeeded: false,
};

describe("createMedDraft", () => {
  it("starts a new med with the default design and no detail from an intake", () => {
    expect(createMedDraft("intake")).toEqual({
      name: "",
      strength: "",
      detail: "",
      design: DEFAULT_PILL_DESIGN,
    });
  });

  it("suggests the as needed detail for a new as needed med", () => {
    expect(createMedDraft("asNeeded").detail).toBe("Si besoin");
  });

  it("starts from an existing med", () => {
    expect(createMedDraft("asNeeded", LITHIUM)).toEqual({
      medId: "lithium",
      name: "Lithium",
      strength: "250 mg",
      detail: "Avec le repas",
      design: LITHIUM.design,
    });
  });
});

describe("toMedValues", () => {
  it("trims the texts", () => {
    const draft = {
      ...createMedDraft("intake"),
      name: " Lithium ",
      strength: "250 mg ",
      detail: " ",
    };

    expect(toMedValues(draft)).toEqual({
      name: "Lithium",
      strength: "250 mg",
      detail: "",
      design: DEFAULT_PILL_DESIGN,
    });
  });

  it("capitalizes only the first letter of the name", () => {
    const toName = (name: string) => toMedValues({ ...createMedDraft("intake"), name }).name;

    expect(toName(" élavil ")).toBe("Élavil");
    expect(toName("acide folique")).toBe("Acide folique");
    expect(toName("DOLIPRANE")).toBe("DOLIPRANE");
  });
});

describe("validateMedDraft", () => {
  it("requires a name", () => {
    expect(validateMedDraft({ ...createMedDraft("intake"), name: "  " })).toBe("missingName");
    expect(validateMedDraft({ ...createMedDraft("intake"), name: "Lithium" })).toBeNull();
  });
});
