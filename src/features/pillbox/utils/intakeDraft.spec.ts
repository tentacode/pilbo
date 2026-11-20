import { WEEKDAYS } from "@/domain/intake";
import type { Med, MedQuantity } from "@/domain/med";

import { createIntake } from "@/features/today/utils/testIntakes";

import {
  addDraftMed,
  createIntakeDraft,
  draftSignature,
  replaceDraftMed,
  type IntakeDraft,
  toIntakeToSave,
  toggleDay,
  withDayMode,
  withFrequency,
} from "./intakeDraft";

const TODAY = "2026-11-20";

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
  it("creates a new intake at 08:00, every day, with the default reminder interval and sound", () => {
    expect(createIntakeDraft(15, "chime", TODAY)).toEqual({
      time: { hour: 8, minute: 0 },
      dayMode: "everyDay",
      frequency: "daily",
      interval: 1,
      startsOn: TODAY,
      days: [...WEEKDAYS],
      reminderIntervalMinutes: 15,
      sound: "chime",
      medQuantities: [],
    });
  });

  it("starts from an existing intake, keeping its reminder interval and sound", () => {
    const intake = { ...createIntake(20, 30), days: ["monday" as const], sound: "drop" as const };

    expect(createIntakeDraft(30, "chime", TODAY, intake)).toEqual({
      intakeId: intake.id,
      time: { hour: 20, minute: 30 },
      dayMode: "custom",
      frequency: "daily",
      interval: 1,
      startsOn: "2026-01-01",
      days: ["monday"],
      reminderIntervalMinutes: 10,
      sound: "drop",
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

    expect(labels(createIntakeDraft(10, "beep", TODAY, intake).medQuantities)).toEqual([
      "Lamictal 50 mg",
      "Lamictal 100 mg",
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
      "Lamictal 50 mg",
      "Lamictal 100 mg",
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

describe("withDayMode", () => {
  it("switches to a custom daily recurrence on every day", () => {
    const draft = createIntakeDraft(10, "beep", TODAY);

    expect(withDayMode(draft, "custom", TODAY, TODAY)).toEqual({
      dayMode: "custom",
      frequency: "daily",
      interval: 1,
      startsOn: TODAY,
      days: [...WEEKDAYS],
    });
  });

  it("keeps the start date of a saved intake", () => {
    const draft = createIntakeDraft(10, "beep", TODAY, createIntake(8, 0));

    expect(withDayMode(draft, "custom", "2026-01-01", TODAY).startsOn).toBe("2026-01-01");
  });

  it("goes back to every day from a custom recurrence", () => {
    const draft: IntakeDraft = {
      ...createIntakeDraft(10, "beep", TODAY),
      dayMode: "custom",
      frequency: "weekly",
      interval: 3,
      startsOn: "2026-12-01",
      days: ["monday"],
    };

    expect(withDayMode(draft, "everyDay", TODAY, TODAY)).toEqual({
      dayMode: "everyDay",
      frequency: "daily",
      interval: 1,
      startsOn: TODAY,
      days: [...WEEKDAYS],
    });
  });

  it("keeps the custom recurrence when custom is chosen again", () => {
    const draft: IntakeDraft = {
      ...createIntakeDraft(10, "beep", TODAY),
      dayMode: "custom",
      frequency: "monthly",
    };

    expect(withDayMode(draft, "custom", TODAY, TODAY)).toEqual({});
  });
});

describe("withFrequency", () => {
  const draft = createIntakeDraft(10, "beep", TODAY);

  it("uses one week out of two by default", () => {
    expect(withFrequency(draft, "weekly", TODAY, TODAY)).toEqual({
      frequency: "weekly",
      interval: 2,
    });
  });

  it("uses every month by default", () => {
    expect(withFrequency(draft, "monthly", TODAY, TODAY)).toEqual({
      frequency: "monthly",
      interval: 1,
    });
  });

  it("uses an interval of 1 for days", () => {
    expect(withFrequency(draft, "daily", TODAY, TODAY)).toEqual({
      frequency: "daily",
      interval: 1,
      startsOn: TODAY,
    });
  });

  it("starts a daily rhythm today, or on the start date of a saved intake", () => {
    const weekly: IntakeDraft = { ...draft, frequency: "weekly", startsOn: "2026-12-07" };

    expect(withFrequency(weekly, "daily", TODAY, TODAY).startsOn).toBe(TODAY);
    expect(withFrequency(weekly, "daily", "2026-01-01", TODAY).startsOn).toBe("2026-01-01");
  });

  it("selects every day when leaving a monthly intake without day", () => {
    expect(
      withFrequency({ ...draft, frequency: "monthly", days: [] }, "weekly", TODAY, TODAY),
    ).toEqual({
      frequency: "weekly",
      interval: 2,
      days: [...WEEKDAYS],
    });
  });
});

describe("draftSignature", () => {
  it("changes with the recurrence", () => {
    const draft = createIntakeDraft(10, "beep", TODAY);

    expect(draftSignature({ ...draft, frequency: "weekly", interval: 2 })).not.toBe(
      draftSignature(draft),
    );
    expect(draftSignature({ ...draft, startsOn: "2026-12-01" })).not.toBe(draftSignature(draft));
  });

  it("changes with the quantities", () => {
    const draft = createIntakeDraft(10, "beep", TODAY, createIntake(8, 0));
    const changed = { ...draft, medQuantities: [{ ...draft.medQuantities[0], quantity: 2 }] };

    expect(draftSignature(changed)).not.toBe(draftSignature(draft));
  });

  it("changes with the sound", () => {
    const draft = createIntakeDraft(10, "beep", TODAY, createIntake(8, 0));

    expect(draftSignature({ ...draft, sound: "shire" })).not.toBe(draftSignature(draft));
  });
});

describe("toIntakeToSave", () => {
  it("saves the recurrence", () => {
    const draft: IntakeDraft = {
      ...createIntakeDraft(10, "beep", TODAY, createIntake(8, 0)),
      dayMode: "custom",
      frequency: "weekly",
      interval: 2,
      startsOn: "2026-11-23",
      days: ["monday"],
    };

    expect(toIntakeToSave(draft)).toEqual(
      expect.objectContaining({
        frequency: "weekly",
        interval: 2,
        startsOn: "2026-11-23",
        days: ["monday"],
      }),
    );
  });

  it("keeps the med identifiers and quantities", () => {
    const draft = createIntakeDraft(10, "beep", TODAY, createIntake(8, 0));

    expect(toIntakeToSave(draft).medQuantities).toEqual([{ medId: "med-8-0", quantity: 1 }]);
  });

  it("keeps the sound", () => {
    const draft = createIntakeDraft(10, "beep", TODAY, createIntake(8, 0));

    expect(toIntakeToSave({ ...draft, sound: "vibration" }).sound).toBe("vibration");
  });
});
