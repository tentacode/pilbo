import { canShowPreviousStartMonth, startDateDaysOf } from "./startDatePicker";

const NOVEMBER = { year: 2026, month: 10 };

describe("startDateDaysOf", () => {
  it("disables past days and marks today and the selected day", () => {
    const days = startDateDaysOf(NOVEMBER, "2026-11-12", "2026-11-02");

    expect(days).toHaveLength(30);
    expect(days[0]).toEqual({
      localDate: "2026-11-01",
      dayOfMonth: 1,
      isToday: false,
      isSelected: false,
      isSelectable: false,
    });
    expect(days[1]).toEqual(expect.objectContaining({ isToday: true, isSelectable: true }));
    expect(days[11]).toEqual(expect.objectContaining({ isSelected: true, isSelectable: true }));
  });

  it("keeps a past start date selected", () => {
    const days = startDateDaysOf({ year: 2026, month: 9 }, "2026-10-05", "2026-11-02");

    expect(days[4]).toEqual(expect.objectContaining({ isSelected: true, isSelectable: false }));
  });
});

describe("canShowPreviousStartMonth", () => {
  it("stops at the month of today", () => {
    expect(canShowPreviousStartMonth(NOVEMBER, "2026-11-12", "2026-11-02")).toBe(false);
    expect(canShowPreviousStartMonth({ year: 2026, month: 11 }, "2026-11-12", "2026-11-02")).toBe(
      true,
    );
  });

  it("allows going back to a past start date", () => {
    expect(canShowPreviousStartMonth(NOVEMBER, "2026-10-05", "2026-11-02")).toBe(true);
  });
});
