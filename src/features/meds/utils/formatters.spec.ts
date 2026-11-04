import { type Intake, WEEKDAYS } from "@/domain/intake";
import type { Med } from "@/domain/med";
import { i18n } from "@/shared/i18n/i18n";

import {
  formatArchiveRefusedMessage,
  formatMedIntakeDetails,
  formatMedRowAccessibilityLabel,
  formatPillAbbreviation,
  formatPillUnitAbbreviation,
  formatScheduledTakeMessage,
  formatTakenAnnouncement,
  formatTakingSummary,
  formatUndoneAnnouncement,
} from "./formatters";

const t = i18n.getFixedT(null, "meds");

const lithium: Med = {
  id: "lithium",
  name: "Lithium",
  strength: "250 mg",
  detail: "",
  design: { shape: "round", colors: ["#D6C9F5", "#D6C9F5"], size: "medium" },
};

function intakeAt(hour: number, quantity = 1): Intake {
  return {
    id: `intake-${hour}`,
    time: { hour, minute: 0 },
    days: [...WEEKDAYS],
    reminderIntervalMinutes: 10,
    medQuantities: [{ med: lithium, quantity }],
  };
}

const stock = { medId: "lithium", quantity: 84, boxSize: 100, lowStockDays: 7 };
const NOW = new Date(2026, 10, 4, 17, 0);

describe("meds formatters", () => {
  it("abbreviates the pills", () => {
    expect(formatPillAbbreviation(t, 84)).toBe("84 cp");
    expect(formatPillAbbreviation(t, 1)).toBe("1 cp");
    expect(formatPillUnitAbbreviation(t, 12)).toBe("cp");
  });

  it("describes a row for VoiceOver", () => {
    expect(formatMedRowAccessibilityLabel(t, { med: lithium })).toBe(
      "Lithium 250 mg, stock non suivi",
    );
    expect(
      formatMedRowAccessibilityLabel(t, {
        med: lithium,
        stockStatus: { stock, forecast: { status: "sufficient", daysLeft: 28 } },
      }),
    ).toBe("Lithium 250 mg, 28 jours, 84 comprimés");
    expect(
      formatMedRowAccessibilityLabel(t, {
        med: lithium,
        stockStatus: { stock: { ...stock, quantity: 5 }, forecast: { status: "low", daysLeft: 5 } },
      }),
    ).toBe("Lithium 250 mg, stock bas, 5 jours, 5 comprimés");
    expect(
      formatMedRowAccessibilityLabel(t, {
        med: lithium,
        stockStatus: { stock: { ...stock, quantity: 12 }, forecast: { status: "noSchedule" } },
      }),
    ).toBe("Lithium 250 mg, 12 comprimés");
  });

  it("names the intakes of a scheduled med", () => {
    expect(formatScheduledTakeMessage(t, [intakeAt(8)])).toBe(
      "Ce médicament est prévu dans la prise de 08:00.",
    );
    expect(formatScheduledTakeMessage(t, [intakeAt(8), intakeAt(12), intakeAt(20)])).toBe(
      "Ce médicament est prévu dans les prises de 08:00, 12:00 et 20:00.",
    );
    expect(formatArchiveRefusedMessage(t, [intakeAt(8)])).toBe(
      "Ce médicament est dans la prise de 08:00. Retirez-le du pilulier d’abord.",
    );
  });

  it("summarizes the takings of the day", () => {
    expect(formatTakingSummary(t, "fr", { todayQuantity: 0 }, NOW)).toBeUndefined();
    expect(
      formatTakingSummary(t, "fr", { todayQuantity: 3, lastTakenAt: "2026-11-04T15:40" }, NOW),
    ).toBe("3 comprimés aujourd’hui · dernier à 15:40");
    expect(
      formatTakingSummary(t, "fr", { todayQuantity: 1, lastTakenAt: "2026-11-04T12:34" }, NOW),
    ).toBe("1 comprimé aujourd’hui · à 12:34");
  });

  it("gives the last taking of a previous day", () => {
    expect(
      formatTakingSummary(t, "fr", { todayQuantity: 0, lastTakenAt: "2026-11-03T15:40" }, NOW),
    ).toBe("Dernière prise : hier à 15:40");
    expect(
      formatTakingSummary(t, "fr", { todayQuantity: 0, lastTakenAt: "2026-11-01T09:05" }, NOW),
    ).toBe("Dernière prise : le 1er novembre à 09:05");
  });

  it("describes the intake of the med", () => {
    expect(
      formatMedIntakeDetails(t, {
        intake: intakeAt(8, 2),
        days: "Tous les jours",
        medId: "lithium",
      }),
    ).toBe("Tous les jours · 2 comprimés");
  });

  it("announces the taking and its cancellation", () => {
    expect(formatTakenAnnouncement(t, lithium, "2026-11-04T15:40")).toBe(
      "Lithium 250 mg pris à 15:40",
    );
    expect(formatUndoneAnnouncement(t, lithium, "2026-11-04T15:40")).toBe(
      "Prise de Lithium 250 mg de 15:40 annulée",
    );
  });
});

describe("in English", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("formats the pills and the summary", () => {
    expect(formatPillAbbreviation(t, 1)).toBe("1 pill");
    expect(formatPillAbbreviation(t, 84)).toBe("84 pills");
    expect(
      formatTakingSummary(t, "en", { todayQuantity: 2, lastTakenAt: "2026-11-04T15:40" }, NOW),
    ).toBe("2 pills today · last at 15:40");
    expect(
      formatTakingSummary(t, "en", { todayQuantity: 0, lastTakenAt: "2026-11-02T15:40" }, NOW),
    ).toBe("Last taken: November 2 at 15:40");
  });
});
