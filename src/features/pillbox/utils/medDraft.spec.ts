import type { Med } from "@/domain/med";

import { createMedDraft, DEFAULT_PILL_DESIGN, toMedValues } from "./medDraft";
import { validateMedDraft } from "./validators";

const LITHIUM: Med = {
  id: "lithium",
  name: "Lithium",
  strength: "250 mg",
  detail: "Avec le repas",
  design: { shape: "round", colors: ["#D6C9F5", "#D6C9F5"], size: "medium" },
};

describe("createMedDraft", () => {
  it("starts a new med with the default design and no detail", () => {
    expect(createMedDraft()).toEqual({
      name: "",
      strength: "",
      detail: "",
      design: DEFAULT_PILL_DESIGN,
    });
  });

  it("defaults to a white round pill", () => {
    expect(DEFAULT_PILL_DESIGN).toEqual({
      shape: "round",
      size: "medium",
      colors: ["#FFFFFF", "#FFFFFF"],
    });
  });

  it("starts from an existing med", () => {
    expect(createMedDraft(LITHIUM)).toEqual({
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
      ...createMedDraft(),
      name: " Lithium ",
      strength: "250 mg ",
      detail: " ",
    };

    expect(toMedValues(draft, "fr")).toEqual({
      name: "Lithium",
      strength: "250 mg",
      detail: "",
      design: DEFAULT_PILL_DESIGN,
    });
  });

  it("capitalizes only the first letter of the name", () => {
    const toName = (name: string) => toMedValues({ ...createMedDraft(), name }, "fr").name;

    expect(toName(" élavil ")).toBe("Élavil");
    expect(toName("acide folique")).toBe("Acide folique");
    expect(toName("DOLIPRANE")).toBe("DOLIPRANE");
  });
});

describe("validateMedDraft", () => {
  it("requires a name", () => {
    expect(validateMedDraft({ ...createMedDraft(), name: "  " })).toBe("missingName");
    expect(validateMedDraft({ ...createMedDraft(), name: "Lithium" })).toBeNull();
  });
});
