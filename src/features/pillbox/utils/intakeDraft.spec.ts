import { WEEKDAYS } from "@/domain/intake";

import { createIntake } from "@/features/today/utils/testIntakes";

import { createIntakeDraft, draftSignature, toIntakeToSave, toggleDay } from "./intakeDraft";

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
