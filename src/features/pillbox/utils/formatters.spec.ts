import type { Intake } from "@/domain/intake";
import { i18n } from "@/shared/i18n/i18n";

import {
  formatColorName,
  formatColorTitle,
  formatDayInitials,
  formatDayName,
  formatIntakeAccessibilityLabel,
  formatIntakeSchedule,
  formatPillDescription,
  formatShapeName,
  formatSizeName,
} from "./formatters";

const t = i18n.getFixedT(null, "pillbox");

const intake: Intake = {
  id: "intake",
  time: { hour: 8, minute: 5 },
  days: ["monday", "wednesday"],
  reminderIntervalMinutes: 10,
  medQuantities: [
    {
      med: {
        id: "lithium",
        name: "Lithium",
        strength: "250 mg",
        detail: "",
        isAsNeeded: false,
        design: { shape: "round", size: "small", colors: ["#FFFFFF", "#FFFFFF"] },
      },
      quantity: 2,
    },
  ],
};

describe("formatDayInitials", () => {
  it("returns the two letters of the day", () => {
    expect(formatDayInitials("monday", "fr")).toBe("Lu");
    expect(formatDayInitials("sunday", "fr")).toBe("Di");
    expect(formatDayInitials("thursday", "en")).toBe("Th");
  });
});

describe("formatDayName", () => {
  it("returns the capitalized day name", () => {
    expect(formatDayName("wednesday", "fr")).toBe("Mercredi");
    expect(formatDayName("wednesday", "en")).toBe("Wednesday");
  });
});

describe("formatIntakeSchedule", () => {
  it("lists the short day names and the reminder interval", () => {
    expect(formatIntakeSchedule(t, "fr", intake)).toBe("Lun, mer · rappel toutes les 10 min");
  });

  it("shows every day", () => {
    const everyDay: Intake = {
      ...intake,
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    };

    expect(formatIntakeSchedule(t, "fr", everyDay)).toBe(
      "Tous les jours · rappel toutes les 10 min",
    );
  });

  it("is translated in English", async () => {
    await i18n.changeLanguage("en");

    expect(formatIntakeSchedule(t, "en", intake)).toBe("Mon, Wed · reminder every 10 min");
  });
});

describe("formatIntakeAccessibilityLabel", () => {
  it("names the time, the days, the reminder and the meds", () => {
    expect(formatIntakeAccessibilityLabel(t, "fr", intake)).toBe(
      "08:05. Lundi, mercredi, rappel toutes les 10 minutes. Lithium 250 mg, quantité 2",
    );
  });
});

describe("formatColorName", () => {
  it("names a swatch color, ignoring the case", () => {
    expect(formatColorName(t, "#d6c9f5")).toBe("lilas");
  });

  it("names any other color as a custom color", () => {
    expect(formatColorName(t, "#F58FB8")).toBe("couleur personnalisée");
  });
});

describe("formatPillDescription", () => {
  it("describes the shape, the size and the colors", () => {
    expect(
      formatPillDescription(t, {
        shape: "capsule",
        size: "medium",
        colors: ["#FBE29A", "#FFFFFF"],
      }),
    ).toBe("Gélule · moyenne · jaune et blanc");
  });

  it("names a color once when both halves are the same", () => {
    expect(
      formatPillDescription(t, { shape: "capsule", size: "small", colors: ["#B3E8E0", "#B3E8E0"] }),
    ).toBe("Gélule · petite · menthe");
  });

  it("describes a single color shape", () => {
    expect(
      formatPillDescription(t, { shape: "softgel", size: "large", colors: ["#F8C6DA", "#F8C6DA"] }),
    ).toBe("Capsule molle · grande · rose");
  });

  it("is translated in English", async () => {
    await i18n.changeLanguage("en");

    expect(
      formatPillDescription(t, {
        shape: "capsule",
        size: "medium",
        colors: ["#FBE29A", "#FFFFFF"],
      }),
    ).toBe("Capsule · medium · yellow and white");
  });
});

describe("formatShapeName", () => {
  it("returns the capitalized shape name", () => {
    expect(formatShapeName(t, "softgel")).toBe("Capsule molle");
    expect(formatShapeName(t, "square")).toBe("Carré");
  });
});

describe("formatSizeName", () => {
  it("returns the capitalized size name", () => {
    expect(formatSizeName(t, "small")).toBe("Petite");
  });
});

describe("formatColorTitle", () => {
  it("returns the capitalized color name", () => {
    expect(formatColorTitle(t, "#C4DDF7")).toBe("Bleu ciel");
    expect(formatColorTitle(t, "#123456")).toBe("Couleur personnalisée");
  });
});
