import { act, renderHook } from "@testing-library/react-native";
import type { ScrollView } from "react-native";

import { useRevealDebugSection } from "./useRevealDebugSection";

async function renderRevealHook(isDebugMode: boolean) {
  const scrollToEnd = jest.fn();
  const hook = await renderHook(
    ({ isDebugMode: debugMode }: { isDebugMode: boolean }) => useRevealDebugSection(debugMode),
    { initialProps: { isDebugMode } },
  );
  hook.result.current.scrollViewReference.current = { scrollToEnd } as unknown as ScrollView;
  return { ...hook, scrollToEnd };
}

describe("useRevealDebugSection", () => {
  it("scrolls to the end once the debug section appears", async () => {
    const { result, scrollToEnd } = await renderRevealHook(true);

    await act(() => result.current.onDebugSectionLayout());

    expect(scrollToEnd).toHaveBeenCalledTimes(1);
  });

  it("does not scroll again on a later layout", async () => {
    const { result, scrollToEnd } = await renderRevealHook(true);

    await act(() => result.current.onDebugSectionLayout());
    await act(() => result.current.onDebugSectionLayout());

    expect(scrollToEnd).toHaveBeenCalledTimes(1);
  });

  it("scrolls again on the next activation", async () => {
    const { result, rerender, scrollToEnd } = await renderRevealHook(true);

    await act(() => result.current.onDebugSectionLayout());
    await rerender({ isDebugMode: false });
    await rerender({ isDebugMode: true });
    await act(() => result.current.onDebugSectionLayout());

    expect(scrollToEnd).toHaveBeenCalledTimes(2);
  });

  it("does not scroll without debug mode", async () => {
    const { result, scrollToEnd } = await renderRevealHook(false);

    await act(() => result.current.onDebugSectionLayout());

    expect(scrollToEnd).not.toHaveBeenCalled();
  });
});
