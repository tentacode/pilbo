import { act, renderHook } from "@testing-library/react-native";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { useDayNavigation } from "./useDayNavigation";

let mockDatabase: Database;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("expo-router", () => {
  const { useEffect } = jest.requireActual<typeof import("react")>("react");
  return { useFocusEffect: (effect: () => void) => useEffect(effect, [effect]) };
});

const NOW = new Date(2026, 9, 24, 9, 0);

describe("useDayNavigation", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
    mockDatabase = createTestDatabase({ now: new Date(2026, 9, 20, 9, 0) });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts on today, without next day", async () => {
    const { result } = await renderHook(() => useDayNavigation());

    expect(result.current).toMatchObject({
      today: "2026-10-24",
      displayedDate: "2026-10-24",
      isToday: true,
      previousDate: "2026-10-23",
      nextDate: null,
    });
  });

  it("moves to a past day and back to today", async () => {
    const { result } = await renderHook(() => useDayNavigation());

    await act(() => result.current.showDate("2026-10-21"));

    expect(result.current).toMatchObject({
      displayedDate: "2026-10-21",
      isToday: false,
      previousDate: "2026-10-20",
      nextDate: "2026-10-22",
    });

    await act(() => result.current.showDate("2026-10-24"));

    expect(result.current.isToday).toBe(true);
  });

  it("stops at the first day of history", async () => {
    const { result } = await renderHook(() => useDayNavigation());

    await act(() => result.current.showDate("2026-09-05"));

    expect(result.current.displayedDate).toBe("2026-09-05");
    expect(result.current.previousDate).toBeNull();
  });

  it("has no previous day without history", async () => {
    mockDatabase = createTestDatabase({ seed: false });

    const { result } = await renderHook(() => useDayNavigation());

    expect(result.current.previousDate).toBeNull();
  });

  it("never shows a future day", async () => {
    const { result } = await renderHook(() => useDayNavigation());

    await act(() => result.current.showDate("2026-10-30"));

    expect(result.current.displayedDate).toBe("2026-10-24");
  });

  it("follows the new day at midnight when it showed today", async () => {
    jest.setSystemTime(new Date(2026, 9, 24, 23, 59));
    const { result } = await renderHook(() => useDayNavigation());

    await act(() => jest.advanceTimersByTime(60_000));

    expect(result.current).toMatchObject({ today: "2026-10-25", displayedDate: "2026-10-25" });
  });

  it("stays on a past day at midnight", async () => {
    jest.setSystemTime(new Date(2026, 9, 24, 23, 59));
    const { result } = await renderHook(() => useDayNavigation());
    await act(() => result.current.showDate("2026-10-21"));

    await act(() => jest.advanceTimersByTime(60_000));

    expect(result.current.displayedDate).toBe("2026-10-21");
  });
});
