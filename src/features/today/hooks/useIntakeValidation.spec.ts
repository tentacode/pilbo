import { act, renderHook } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { AccessibilityInfo } from "react-native";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";
import { getStockByMedId } from "@/features/stocks/queries/getStockByMedId";
import { saveStock } from "@/features/stocks/queries/saveStock";
import { findMedId } from "@/features/stocks/queries/testStocks";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import { insertIntakeLog } from "@/features/today/queries/insertIntakeLog";
import { getIntakesOfDay } from "@/features/today/queries/getIntakesOfDay";

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
    const intakes = getIntakesOfDay(mockDatabase, NOW);
    const onValidated = jest.fn();
    const { result } = await renderHook(() => useIntakeValidation(intakes, onValidated, jest.fn()));

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

  it("plays a success haptic and announces a taken intake", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
    const intakes = getIntakesOfDay(mockDatabase, NOW);
    const { result } = await renderHook(() => useIntakeValidation(intakes, jest.fn(), jest.fn()));

    await act(() => result.current.validate(intakes[0].id, "taken"));

    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success,
    );
    expect(announce).toHaveBeenCalledWith(expect.stringContaining("validée"));
  });

  it("announces a skipped intake without the success haptic", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
    const intakes = getIntakesOfDay(mockDatabase, NOW);
    const { result } = await renderHook(() => useIntakeValidation(intakes, jest.fn(), jest.fn()));

    await act(() => result.current.validate(intakes[0].id, "skipped"));

    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    expect(announce).toHaveBeenCalledWith(expect.stringContaining("ignorée"));
  });

  it("keeps the log when the reminders cannot be rescheduled", async () => {
    jest.mocked(rescheduleReminders).mockRejectedValueOnce(new Error("Notifications failed"));
    const intakes = getIntakesOfDay(mockDatabase, NOW);
    const { result } = await renderHook(() => useIntakeValidation(intakes, jest.fn(), jest.fn()));

    await act(() => result.current.validate(intakes[0].id, "skipped"));

    expect(getIntakeLogsOfDay(mockDatabase, "2026-10-14")).toHaveLength(1);
    expect(console.error).toHaveBeenCalled();
    expect(result.current.validatingIntakeId).toBeNull();
  });

  it("enables the buttons again when the log cannot be saved", async () => {
    jest.mocked(insertIntakeLog).mockImplementationOnce(() => {
      throw new Error("Database failed");
    });
    const intakes = getIntakesOfDay(mockDatabase, NOW);
    const onValidated = jest.fn();
    const { result } = await renderHook(() => useIntakeValidation(intakes, onValidated, jest.fn()));

    await act(() => result.current.validate(intakes[0].id, "taken"));

    expect(onValidated).not.toHaveBeenCalled();
    expect(rescheduleReminders).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(result.current.validatingIntakeId).toBeNull();
  });

  describe("stocks", () => {
    function quantityOf(name: string, strength: string) {
      return getStockByMedId(mockDatabase, findMedId(mockDatabase, name, strength))?.stock.quantity;
    }

    it("decreases the stocks of a taken intake and ignores the meds without stock", async () => {
      const intakes = getIntakesOfDay(mockDatabase, NOW);
      const bedtime = intakes[3];
      const onStocksBelowZero = jest.fn();
      const { result } = await renderHook(() =>
        useIntakeValidation(intakes, jest.fn(), onStocksBelowZero),
      );

      await act(() => result.current.validate(bedtime.id, "taken"));

      expect(quantityOf("Lamictal", "100 mg")).toBe(55);
      expect(quantityOf("Quviviq", "50 mg")).toBeUndefined();
      expect(onStocksBelowZero).not.toHaveBeenCalled();
    });

    it("keeps the stocks of a skipped intake", async () => {
      const intakes = getIntakesOfDay(mockDatabase, NOW);
      const { result } = await renderHook(() => useIntakeValidation(intakes, jest.fn(), jest.fn()));

      await act(() => result.current.validate(intakes[0].id, "skipped"));

      expect(quantityOf("Lithium", "250 mg")).toBe(18);
      expect(quantityOf("Lamictal", "50 mg")).toBe(45);
    });

    it("reports the meds going below zero", async () => {
      saveStock(mockDatabase, {
        medId: findMedId(mockDatabase, "Lithium", "250 mg"),
        quantity: 1,
        boxSize: 100,
        lowStockDays: 7,
      });
      const intakes = getIntakesOfDay(mockDatabase, NOW);
      const evening = intakes[2];
      const onStocksBelowZero = jest.fn();
      const { result } = await renderHook(() =>
        useIntakeValidation(intakes, jest.fn(), onStocksBelowZero),
      );

      await act(() => result.current.validate(evening.id, "taken"));

      expect(quantityOf("Lithium", "250 mg")).toBe(-1);
      expect(onStocksBelowZero).toHaveBeenCalledWith([
        expect.objectContaining({ name: "Lithium", strength: "250 mg" }),
      ]);
    });

    it("keeps the stocks when the log cannot be saved", async () => {
      jest.mocked(insertIntakeLog).mockImplementationOnce(() => {
        throw new Error("Database failed");
      });
      const intakes = getIntakesOfDay(mockDatabase, NOW);
      const { result } = await renderHook(() => useIntakeValidation(intakes, jest.fn(), jest.fn()));

      await act(() => result.current.validate(intakes[0].id, "taken"));

      expect(quantityOf("Lithium", "250 mg")).toBe(18);
    });
  });
});
