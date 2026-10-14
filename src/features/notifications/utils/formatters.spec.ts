import { createIntake } from "@/features/today/utils/testIntakes";

import { formatReminderBody, formatReminderTitle } from "./formatters";

describe("formatReminderTitle", () => {
  it("names the intake time", () => {
    expect(formatReminderTitle(createIntake(8, 20))).toBe("C'est l'heure de votre prise de 08:20");
  });
});

describe("formatReminderBody", () => {
  it("lists the meds with their quantity", () => {
    const intake = createIntake(8, 20);
    const [lithium] = intake.medQuantities;
    const lamictal = {
      med: { ...lithium.med, id: "lamictal", name: "Lamictal", strength: "50 mg" },
      quantity: 2,
    };

    expect(formatReminderBody({ ...intake, medQuantities: [lithium, lamictal] })).toBe(
      "1 × Lithium 250 mg, 2 × Lamictal 50 mg",
    );
  });
});
