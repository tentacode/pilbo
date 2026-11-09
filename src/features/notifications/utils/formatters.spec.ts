import { createIntake } from "@/features/today/utils/testIntakes";
import { i18n } from "@/shared/i18n/i18n";

import {
  formatLowStockAlertBody,
  formatLowStockAlertTitle,
  formatReminderBody,
  formatReminderTitle,
  formatSoundName,
} from "./formatters";

const t = i18n.getFixedT(null, "notifications");

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

describe("formatLowStockAlertBody", () => {
  it("lists the meds to renew", () => {
    expect(formatLowStockAlertBody([{ name: "Lithium", strength: "250 mg" }])).toBe(
      "Lithium 250 mg : pensez à le renouveler.",
    );
    expect(
      formatLowStockAlertBody([
        { name: "Lithium", strength: "250 mg" },
        { name: "Lamictal", strength: "50 mg" },
      ]),
    ).toBe("Lithium 250 mg, Lamictal 50 mg : pensez à les renouveler.");
  });
});

describe("formatSoundName", () => {
  it.each([
    ["beep_short", "Beep Boop"],
    ["beep", "Beep Boop Beep Boop"],
    ["chime", "Sonnette"],
    ["drop", "Glissade"],
    ["pill_rattle", "Secoue ton pilbo"],
    ["gentle_alert_resolved", "Fantôme"],
    ["nocturne", "Nocturne"],
    ["shire", "Pilbo Sacquet"],
    ["vibration", "Vibration seule"],
  ] as const)("names %s", (sound, expected) => {
    expect(formatSoundName(t, sound)).toBe(expected);
  });
});

describe("in English", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("translates the reminder title", () => {
    expect(formatReminderTitle(createIntake(8, 20))).toBe("Time for your 08:20 intake");
  });

  it("translates the low stock alert", () => {
    expect(formatLowStockAlertTitle()).toBe("Low stock");
    expect(formatLowStockAlertBody([{ name: "Lithium", strength: "250 mg" }])).toBe(
      "Lithium 250 mg: consider renewing it.",
    );
    expect(
      formatLowStockAlertBody([
        { name: "Lithium", strength: "250 mg" },
        { name: "Lamictal", strength: "50 mg" },
      ]),
    ).toBe("Lithium 250 mg, Lamictal 50 mg: consider renewing them.");
  });

  it.each([
    ["beep_short", "Beep Boop"],
    ["beep", "Beep Boop Beep Boop"],
    ["chime", "Doorbell"],
    ["drop", "Slippery"],
    ["pill_rattle", "Shake your pilbo"],
    ["gentle_alert_resolved", "Spooky"],
    ["nocturne", "Nocturne"],
    ["shire", "Pilbo Baggins"],
    ["vibration", "Vibration only"],
  ] as const)("translates the name of %s", (sound, expected) => {
    expect(formatSoundName(t, sound)).toBe(expected);
  });
});
