import { WEEKDAYS } from "@/domain/intake";
import type { Med, MedQuantity } from "@/domain/med";

import { createIntake } from "@/features/today/utils/testIntakes";

import {
  addDraftMed,
  createIntakeDraft,
  draftSignature,
  replaceDraftMed,
  toIntakeToSave,
  toggleDay,
} from "./intakeDraft";

function createMed(name: string, strength: string): Med {
  return {
    id: `${name}-${strength}`,
    name,
    strength,
    detail: "",
    design: { shape: "oval", colors: ["#FFFFFF", "#FFFFFF"], size: "medium" },
  };
}

function labels(medQuantities: MedQuantity[]): string[] {
  return medQuantities.map(({ med }) => `${med.name} ${med.strength}`);
}

describe("createIntakeDraft", () => {
  it("creates a new intake at 08:00, every day, with the default reminder interval", () => {
    expect(createIntakeDraft(15)).toEqual({
      time: { hour: 8, minute: 0 },
      dayMode: "everyDay",
      days: [...WEEKDAYS],
      reminderIntervalMinutes: 15,
      medQuantities: [],
    });
  });

  it("starts from an existing intake, keeping its reminder interval", () => {
    const intake = { ...createIntake(20, 30), days: ["monday" as const] };

    expect(createIntakeDraft(30, intake)).toEqual({
      intakeId: intake.id,
      time: { hour: 20, minute: 30 },
      dayMode: "someDays",
      days: ["monday"],
      reminderIntervalMinutes: 10,
      medQuantities: intake.medQuantities,
    });
  });

  it("sorts the meds of an existing intake", () => {
    const intake = {
      ...createIntake(8, 0),
      medQuantities: [
        { med: createMed("Lithium", "250 mg"), quantity: 1 },
        { med: createMed("Lamictal", "50 mg"), quantity: 1 },
        { med: createMed("Lamictal", "100 mg"), quantity: 1 },
      ],
    };

    expect(labels(createIntakeDraft(10, intake).medQuantities)).toEqual([
      "Lamictal 100 mg",
      "Lamictal 50 mg",
      "Lithium 250 mg",
    ]);
  });
});

describe("addDraftMed", () => {
  it("inserts the med at its sorted place", () => {
    const medQuantities = [
      { med: createMed("Lamictal", "100 mg"), quantity: 1 },
      { med: createMed("Lithium", "250 mg"), quantity: 1 },
    ];

    expect(labels(addDraftMed(medQuantities, createMed("Lamictal", "50 mg"), 2))).toEqual([
      "Lamictal 100 mg",
      "Lamictal 50 mg",
      "Lithium 250 mg",
    ]);
  });
});

describe("replaceDraftMed", () => {
  it("sorts the meds again after a rename", () => {
    const lamictal = createMed("Lamictal", "50 mg");
    const medQuantities = [
      { med: lamictal, quantity: 1 },
      { med: createMed("Lithium", "250 mg"), quantity: 1 },
    ];

    expect(labels(replaceDraftMed(medQuantities, { ...lamictal, name: "Quviviq" }))).toEqual([
      "Lithium 250 mg",
      "Quviviq 50 mg",
    ]);
  });
});

describe("toggleDay", () => {
  it("adds a day in the week order", () => {
    expect(toggleDay(["monday", "friday"], "wednesday")).toEqual(["monday", "wednesday", "friday"]);
  });

  it("removes a selected day", () => {
    expect(toggleDay(["monday", "friday"], "monday")).toEqual(["friday"]);
  });
});

describe("draftSignature", () => {
  it("ignores the day mode when every day is selected", () => {
    const draft = createIntakeDraft(10);

    expect(draftSignature({ ...draft, dayMode: "someDays" })).toBe(draftSignature(draft));
  });

  it("changes with the quantities", () => {
    const draft = createIntakeDraft(10, createIntake(8, 0));
    const changed = { ...draft, medQuantities: [{ ...draft.medQuantities[0], quantity: 2 }] };

    expect(draftSignature(changed)).not.toBe(draftSignature(draft));
  });
});

describe("toIntakeToSave", () => {
  it("saves every day with the every day mode", () => {
    const draft = { ...createIntakeDraft(10, createIntake(8, 0)), days: ["monday" as const] };

    expect(toIntakeToSave({ ...draft, dayMode: "everyDay" }).days).toEqual([...WEEKDAYS]);
    expect(toIntakeToSave({ ...draft, dayMode: "someDays" }).days).toEqual(["monday"]);
  });

  it("keeps the med identifiers and quantities", () => {
    const draft = createIntakeDraft(10, createIntake(8, 0));

    expect(toIntakeToSave(draft).medQuantities).toEqual([{ medId: "med-8-0", quantity: 1 }]);
  });
});
