import { act, renderHook } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { AccessibilityInfo } from "react-native";

import { DEBUG_MODE_PRESS_COUNT, useDebugModeToggle } from "./useDebugModeToggle";

async function press(result: { current: ReturnType<typeof useDebugModeToggle> }, times: number) {
  for (let index = 0; index < times; index += 1) {
    await act(() => result.current.registerPress());
  }
}

describe("useDebugModeToggle", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("is disabled by default", async () => {
    const { result } = await renderHook(() => useDebugModeToggle());

    expect(result.current.isDebugMode).toBe(false);
  });

  it("stays disabled before the 10th press", async () => {
    const { result } = await renderHook(() => useDebugModeToggle());

    await press(result, DEBUG_MODE_PRESS_COUNT - 1);

    expect(result.current.isDebugMode).toBe(false);
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it("enables the debug mode at the 10th press, with a haptic and an announcement", async () => {
    const { result } = await renderHook(() => useDebugModeToggle());

    await press(result, DEBUG_MODE_PRESS_COUNT);

    expect(result.current.isDebugMode).toBe(true);
    expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith("Mode debug activé");
  });

  it("disables the debug mode after 10 more presses", async () => {
    const { result } = await renderHook(() => useDebugModeToggle());

    await press(result, DEBUG_MODE_PRESS_COUNT * 2);

    expect(result.current.isDebugMode).toBe(false);
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenLastCalledWith(
      "Mode debug désactivé",
    );
  });

  it("restarts the count after 2 seconds without press", async () => {
    const { result } = await renderHook(() => useDebugModeToggle());

    await press(result, DEBUG_MODE_PRESS_COUNT - 1);
    await act(() => jest.advanceTimersByTime(2000));
    await press(result, 1);

    expect(result.current.isDebugMode).toBe(false);

    await press(result, DEBUG_MODE_PRESS_COUNT - 1);

    expect(result.current.isDebugMode).toBe(true);
  });

  it("keeps the count with presses less than 2 seconds apart", async () => {
    const { result } = await renderHook(() => useDebugModeToggle());

    for (let index = 0; index < DEBUG_MODE_PRESS_COUNT; index += 1) {
      await act(() => jest.advanceTimersByTime(1900));
      await press(result, 1);
    }

    expect(result.current.isDebugMode).toBe(true);
  });
});
