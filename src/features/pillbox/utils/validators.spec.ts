import { createIntake } from "@/features/today/utils/testIntakes";

import { createIntakeDraft, type IntakeDraft } from "./intakeDraft";
import { validateIntakeDraft } from "./validators";

function validDraft(): IntakeDraft {
  return createIntakeDraft(10, createIntake(8, 0));
}

function draftWithQuantity(quantity: number): IntakeDraft {
  const draft = validDraft();
  return { ...draft, medQuantities: [{ ...draft.medQuantities[0], quantity }] };
}

describe("validateIntakeDraft", () => {
  it("accepts a draft with a med and every day", () => {
    expect(validateIntakeDraft(validDraft())).toBeNull();
  });

  it("requires at least one med", () => {
    expect(validateIntakeDraft(createIntakeDraft(10))).toBe("missingMed");
  });

  it("requires at least one day with some days", () => {
    expect(validateIntakeDraft({ ...validDraft(), dayMode: "someDays", days: [] })).toBe(
      "missingDay",
    );
  });

  it("ignores the selected days with every day", () => {
    expect(validateIntakeDraft({ ...validDraft(), dayMode: "everyDay", days: [] })).toBeNull();
  });

  it.each([1, 10])("accepts a quantity of %i", (quantity) => {
    expect(validateIntakeDraft(draftWithQuantity(quantity))).toBeNull();
  });

  it.each([0, 11, 1.5])("rejects a quantity of %s", (quantity) => {
    expect(validateIntakeDraft(draftWithQuantity(quantity))).toBe("invalidQuantity");
  });
});
