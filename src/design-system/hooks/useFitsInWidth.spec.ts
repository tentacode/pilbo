import { act, renderHook } from "@testing-library/react-native";
import type { LayoutChangeEvent } from "react-native";

import { useFitsInWidth } from "./useFitsInWidth";

function layoutEvent(width: number) {
  return { nativeEvent: { layout: { x: 0, y: 0, width, height: 0 } } } as LayoutChangeEvent;
}

describe("useFitsInWidth", () => {
  it("fits before the first measure", async () => {
    const { result } = await renderHook(() => useFitsInWidth(300));

    expect(result.current.fits).toBe(true);
  });

  it("fits when the measured width is large enough", async () => {
    const { result } = await renderHook(() => useFitsInWidth(300));

    await act(() => result.current.onLayout(layoutEvent(300)));

    expect(result.current.fits).toBe(true);
  });

  it("does not fit when the measured width is too small", async () => {
    const { result } = await renderHook(() => useFitsInWidth(300));

    await act(() => result.current.onLayout(layoutEvent(299)));

    expect(result.current.fits).toBe(false);
  });

  it("follows the required width when it changes", async () => {
    const { result, rerender } = await renderHook(
      ({ requiredWidth }: { requiredWidth: number }) => useFitsInWidth(requiredWidth),
      { initialProps: { requiredWidth: 300 } },
    );
    await act(() => result.current.onLayout(layoutEvent(320)));

    await rerender({ requiredWidth: 340 });

    expect(result.current.fits).toBe(false);
  });
});
