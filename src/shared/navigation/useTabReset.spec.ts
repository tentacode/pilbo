import { act, renderHook, waitFor } from "@testing-library/react-native";
import { StackActions } from "expo-router/react-navigation";
import { AccessibilityInfo, type ScrollView } from "react-native";

import { useTabResetStore } from "./tabResetStore";
import { useTabReset } from "./useTabReset";

const mockNavigation = { getState: jest.fn(), dispatch: jest.fn() };

jest.mock("expo-router", () => ({ useNavigation: () => mockNavigation }));

async function renderTabReset(onReset?: () => void) {
  const { result } = await renderHook(() => useTabReset("meds", onReset));
  const scrollTo = jest.fn();
  result.current.current = { scrollTo } as unknown as ScrollView;
  return scrollTo;
}

describe("useTabReset", () => {
  beforeEach(() => {
    useTabResetStore.setState({ requestCounts: { today: 0, meds: 0 } });
    mockNavigation.getState.mockReturnValue({ index: 0 });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("scrolls to the top when the tab is reset", async () => {
    const onReset = jest.fn();
    const scrollTo = await renderTabReset(onReset);

    await act(() => useTabResetStore.getState().requestTabReset("meds"));

    expect(scrollTo).toHaveBeenCalledWith({ y: 0, animated: true });
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(mockNavigation.dispatch).not.toHaveBeenCalled();
  });

  it("ignores the resets of the other tabs", async () => {
    const scrollTo = await renderTabReset();

    await act(() => useTabResetStore.getState().requestTabReset("today"));

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("goes back to the first screen of the tab", async () => {
    mockNavigation.getState.mockReturnValue({ index: 1 });
    await renderTabReset();

    await act(() => useTabResetStore.getState().requestTabReset("meds"));

    expect(mockNavigation.dispatch).toHaveBeenCalledWith(StackActions.popToTop());
  });

  it("scrolls without animation when reduce motion is enabled", async () => {
    jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(true);
    const scrollTo = await renderTabReset();
    await waitFor(() => expect(AccessibilityInfo.isReduceMotionEnabled).toHaveBeenCalled());

    await act(() => useTabResetStore.getState().requestTabReset("meds"));

    expect(scrollTo).toHaveBeenCalledWith({ y: 0, animated: false });
  });
});
