import type { Med } from "@/domain/med";
import { i18n } from "@/shared/i18n/i18n";

import { createMedDraft, DEFAULT_PILL_DESIGN, toMedValues } from "./medDraft";
import { validateMedDraft } from "./validators";

const t = i18n.getFixedT(null, "pillbox");

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
    expect(createMedDraft(t, "intake")).toEqual({
      name: "",
      strength: "",
      detail: "",
      design: DEFAULT_PILL_DESIGN,
    });
  });

  it("suggests the as needed detail for a new as needed med", () => {
    expect(createMedDraft(t, "asNeeded").detail).toBe("Si besoin");
  });

  it("starts from an existing med", () => {
    expect(createMedDraft(t, "asNeeded", LITHIUM)).toEqual({
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
      ...createMedDraft(t, "intake"),
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
    const toName = (name: string) =>
      toMedValues({ ...createMedDraft(t, "intake"), name }, "fr").name;

    expect(toName(" élavil ")).toBe("Élavil");
    expect(toName("acide folique")).toBe("Acide folique");
    expect(toName("DOLIPRANE")).toBe("DOLIPRANE");
  });
});

describe("validateMedDraft", () => {
  it("requires a name", () => {
    expect(validateMedDraft({ ...createMedDraft(t, "intake"), name: "  " })).toBe("missingName");
    expect(validateMedDraft({ ...createMedDraft(t, "intake"), name: "Lithium" })).toBeNull();
  });
});
