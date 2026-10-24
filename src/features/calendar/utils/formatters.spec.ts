import { i18n } from "@/shared/i18n/i18n";

import type { CalendarDay } from "./calendarTypes";
import {
  formatCalendarDayAccessibilityLabel,
  formatMonthTitle,
  formatNextMonthAccessibilityLabel,
  formatPreviousMonthAccessibilityLabel,
  formatWeekdayHeaders,
} from "./formatters";

const t = i18n.getFixedT(null, "calendar");

function day(changes: Partial<CalendarDay>): CalendarDay {
  return {
    localDate: "2026-10-08",
    dayOfMonth: 8,
    status: "none",
    isToday: false,
    isSelectable: true,
    ...changes,
  };
}

describe("calendar formatters", () => {
  it("formats the month title and the navigation labels", () => {
    expect(formatMonthTitle({ year: 2026, month: 9 }, "fr")).toBe("Octobre 2026");
    expect(formatPreviousMonthAccessibilityLabel(t, { year: 2026, month: 8 }, "fr")).toBe(
      "Mois précédent : septembre",
    );
    expect(formatNextMonthAccessibilityLabel(t, { year: 2026, month: 10 }, "fr")).toBe(
      "Mois suivant : novembre",
    );
  });

  it("formats the weekday headers from Monday", () => {
    expect(formatWeekdayHeaders("fr")).toEqual(["lun", "mar", "mer", "jeu", "ven", "sam", "dim"]);
  });

  it.each([
    [day({ status: "none" }), "8 octobre : aucune prise"],
    [day({ status: "late" }), "8 octobre : pris en retard"],
    [day({ status: "taken" }), "8 octobre : pris"],
    [day({ status: "missed" }), "8 octobre : non pris"],
    [day({ status: "skipped", localDate: "2026-10-01" }), "1er octobre : ignoré"],
    [day({ status: "taken", isToday: true }), "8 octobre, aujourd'hui : pris"],
    [day({ status: "none", isToday: true }), "8 octobre, aujourd'hui"],
    [day({ isSelectable: false }), "8 octobre"],
  ])("labels a day for VoiceOver", (calendarDay, expected) => {
    expect(formatCalendarDayAccessibilityLabel(t, calendarDay, "fr")).toBe(expected);
  });

  describe("in English", () => {
    beforeEach(async () => {
      await i18n.changeLanguage("en");
    });

    it("formats the month, the weekdays and the days", () => {
      expect(formatMonthTitle({ year: 2026, month: 9 }, "en")).toBe("October 2026");
      expect(formatWeekdayHeaders("en")).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
      expect(formatCalendarDayAccessibilityLabel(t, day({ status: "late" }), "en")).toBe(
        "October 8: taken late",
      );
      expect(
        formatCalendarDayAccessibilityLabel(t, day({ status: "taken", isToday: true }), "en"),
      ).toBe("October 8, today: taken");
    });
  });
});
