import type * as Notifications from "expo-notifications";

import { database } from "@/shared/database/database";

import { applyReminderAction } from "./applyReminderAction";
import { completeReminderAction } from "./reminderActionSupport";
import { handleReminderAction } from "./reminderActionHandling";
import { rescheduleReminders } from "./rescheduleReminders";

jest.mock("@/shared/database/database", () => ({ database: {} }));
jest.mock("@/shared/database/migrateDatabase", () => ({
  migrateDatabase: jest.fn(() => Promise.resolve()),
}));
jest.mock("./applyReminderAction", () => ({ applyReminderAction: jest.fn() }));
jest.mock("./reminderActionSupport", () => ({
  completeReminderAction: jest.fn(),
  registerBackgroundReminderActions: jest.fn(),
}));
jest.mock("./rescheduleReminders", () => ({
  rescheduleReminders: jest.fn(() => Promise.resolve()),
}));

const REMINDER_IDENTIFIER = "reminder-intake-1-2026-10-14T08:20";
const REMINDER_INTAKE = { intakeId: "intake-1", intakeDay: "2026-10-14" };

function responseTo(actionIdentifier: string): Notifications.NotificationResponse {
  return {
    actionIdentifier,
    notification: {
      request: { identifier: REMINDER_IDENTIFIER, content: { data: REMINDER_INTAKE } },
    },
  } as unknown as Notifications.NotificationResponse;
}

describe("handleReminderAction", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("logs the intake, reschedules, then completes the action", async () => {
    await handleReminderAction(responseTo("intake-reminder-taken"));

    expect(applyReminderAction).toHaveBeenCalledWith(
      database,
      REMINDER_INTAKE,
      "taken",
      expect.any(Date),
    );
    expect(rescheduleReminders).toHaveBeenCalledTimes(1);
    expect(completeReminderAction).toHaveBeenCalledWith(
      REMINDER_IDENTIFIER,
      "intake-reminder-taken",
    );
  });

  it("completes the action even when rescheduling fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    jest.mocked(rescheduleReminders).mockRejectedValueOnce(new Error("failure"));

    await handleReminderAction(responseTo("intake-reminder-skipped"));

    expect(completeReminderAction).toHaveBeenCalledTimes(1);
  });

  it("ignores a tap on the notification", async () => {
    await handleReminderAction(responseTo("expo.modules.notifications.actions.DEFAULT"));

    expect(applyReminderAction).not.toHaveBeenCalled();
    expect(completeReminderAction).not.toHaveBeenCalled();
  });
});
