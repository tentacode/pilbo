import { act, renderHook } from "@testing-library/react-native";

import { i18n } from "@/shared/i18n/i18n";

import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";
import { useReminderScheduling } from "./useReminderScheduling";

jest.mock("@/shared/database/database", () => ({ database: {} }));
jest.mock("@/features/notifications/rescheduleReminders", () => ({
  rescheduleReminders: jest.fn(() => Promise.resolve()),
}));

describe("useReminderScheduling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reschedules the reminders when the database is ready", async () => {
    await renderHook(() => useReminderScheduling(true));

    expect(rescheduleReminders).toHaveBeenCalledTimes(1);
  });

  it("does nothing before the database is ready", async () => {
    await renderHook(() => useReminderScheduling(false));
    await act(() => i18n.changeLanguage("en"));

    expect(rescheduleReminders).not.toHaveBeenCalled();
  });

  it("reschedules the reminders when the language changes", async () => {
    await renderHook(() => useReminderScheduling(true));
    jest.mocked(rescheduleReminders).mockClear();

    await act(() => i18n.changeLanguage("en"));

    expect(rescheduleReminders).toHaveBeenCalledTimes(1);
  });
});
