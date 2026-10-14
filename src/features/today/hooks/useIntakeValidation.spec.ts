import { act, renderHook } from "@testing-library/react-native";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import { insertIntakeLog } from "@/features/today/queries/insertIntakeLog";
import { getTodayIntakes } from "@/features/today/queries/getTodayIntakes";

import { useIntakeValidation } from "./useIntakeValidation";

let mockDatabase: Database;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("@/features/notifications/rescheduleReminders", () => ({
  rescheduleReminders: jest.fn(() => Promise.resolve()),
}));
jest.mock("@/features/today/queries/insertIntakeLog", () => ({
  insertIntakeLog: jest.fn(
    jest.requireActual<typeof import("@/features/today/queries/insertIntakeLog")>(
      "@/features/today/queries/insertIntakeLog",
    ).insertIntakeLog,
  ),
}));

const NOW = new Date(2026, 9, 14, 9, 5);

describe("useIntakeValidation", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockDatabase = createTestDatabase();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("saves the log, refreshes the screen and reschedules the reminders", async () => {
    const intakes = getTodayIntakes(mockDatabase, "wednesday");
    const onValidated = jest.fn();
    const { result } = await renderHook(() => useIntakeValidation(intakes, onValidated));

    await act(() => result.current.validate(intakes[0].id, "taken"));

    expect(getIntakeLogsOfDay(mockDatabase, "2026-10-14")).toEqual([
      expect.objectContaining({
        intakeId: intakes[0].id,
        expectedIntakeAt: "2026-10-14T08:20",
        createdAt: "2026-10-14T09:05",
        status: "taken",
      }),
    ]);
    expect(onValidated).toHaveBeenCalledTimes(1);
    expect(rescheduleReminders).toHaveBeenCalledWith(mockDatabase, NOW);
    expect(result.current.validatingIntakeId).toBeNull();
  });

  it("keeps the log when the reminders cannot be rescheduled", async () => {
    jest.mocked(rescheduleReminders).mockRejectedValueOnce(new Error("Notifications failed"));
    const intakes = getTodayIntakes(mockDatabase, "wednesday");
    const { result } = await renderHook(() => useIntakeValidation(intakes, jest.fn()));

    await act(() => result.current.validate(intakes[0].id, "skipped"));

    expect(getIntakeLogsOfDay(mockDatabase, "2026-10-14")).toHaveLength(1);
    expect(console.error).toHaveBeenCalled();
    expect(result.current.validatingIntakeId).toBeNull();
  });

  it("enables the buttons again when the log cannot be saved", async () => {
    jest.mocked(insertIntakeLog).mockImplementationOnce(() => {
      throw new Error("Database failed");
    });
    const intakes = getTodayIntakes(mockDatabase, "wednesday");
    const onValidated = jest.fn();
    const { result } = await renderHook(() => useIntakeValidation(intakes, onValidated));

    await act(() => result.current.validate(intakes[0].id, "taken"));

    expect(onValidated).not.toHaveBeenCalled();
    expect(rescheduleReminders).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(result.current.validatingIntakeId).toBeNull();
  });
});
