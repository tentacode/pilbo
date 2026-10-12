import { act, renderHook } from "@testing-library/react-native";
import { AppState, type AppStateStatus } from "react-native";

import { useCurrentMinute } from "./useCurrentMinute";

describe("useCurrentMinute", () => {
  let appStateListener: ((state: AppStateStatus) => void) | undefined;
  const removeSubscription = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 9, 4, 12, 0, 45));
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, listener) => {
      appStateListener = listener;
      return { remove: removeSubscription };
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("updates the date at the start of the next minute", async () => {
    const { result } = await renderHook(() => useCurrentMinute());
    expect(result.current.getMinutes()).toBe(0);

    await act(() => jest.advanceTimersByTime(14_000));
    expect(result.current.getMinutes()).toBe(0);

    await act(() => jest.advanceTimersByTime(1_000));
    expect(result.current.getMinutes()).toBe(1);

    await act(() => jest.advanceTimersByTime(60_000));
    expect(result.current.getMinutes()).toBe(2);
  });

  it("updates the date when the app comes back to the foreground", async () => {
    const { result } = await renderHook(() => useCurrentMinute());
    jest.setSystemTime(new Date(2026, 9, 4, 15, 30, 10));

    await act(() => appStateListener?.("active"));

    expect(result.current.getHours()).toBe(15);
    expect(result.current.getMinutes()).toBe(30);
  });

  it("stops listening when unmounted", async () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { unmount } = await renderHook(() => useCurrentMinute());

    await unmount();

    expect(removeSubscription).toHaveBeenCalled();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
