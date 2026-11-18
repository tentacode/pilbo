import { reminderActionStatus, reminderIntakeOf } from "./reminderActions";

describe("reminderActionStatus", () => {
  it("returns the status of a reminder action", () => {
    expect(reminderActionStatus("intake-reminder-taken")).toBe("taken");
    expect(reminderActionStatus("intake-reminder-skipped")).toBe("skipped");
  });

  it("returns nothing for a tap on the notification", () => {
    expect(reminderActionStatus("expo.modules.notifications.actions.DEFAULT")).toBeUndefined();
    expect(reminderActionStatus(undefined)).toBeUndefined();
  });
});

describe("reminderIntakeOf", () => {
  it("reads the intake of a reminder", () => {
    expect(
      reminderIntakeOf({
        data: { intakeId: "intake-1", intakeDay: "2026-10-14", presentationGroup: "x" },
      }),
    ).toEqual({ intakeId: "intake-1", intakeDay: "2026-10-14" });
  });

  it("reads the intake from raw data as a JSON string", () => {
    expect(
      reminderIntakeOf({ dataString: '{"intakeId":"intake-1","intakeDay":"2026-10-14"}' }),
    ).toEqual({ intakeId: "intake-1", intakeDay: "2026-10-14" });
  });

  it("returns nothing without an intake", () => {
    expect(reminderIntakeOf({ data: { presentationGroup: "x" } })).toBeUndefined();
    expect(reminderIntakeOf({})).toBeUndefined();
  });
});
