import { renderHook } from "@testing-library/react-native";
import { useColorScheme } from "react-native";

import { darkColors, lightColors } from "../tokens";
import { createThemedStyles } from "./createThemedStyles";

jest.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useStyles = createThemedStyles((themeColors) => ({
  card: { borderColor: themeColors.line },
}));

describe("createThemedStyles", () => {
  it("uses the light palette in light mode", async () => {
    jest.mocked(useColorScheme).mockReturnValue("light");

    const { result } = await renderHook(() => useStyles());

    expect(result.current.card.borderColor).toBe(lightColors.line);
  });

  it("uses the dark palette in dark mode", async () => {
    jest.mocked(useColorScheme).mockReturnValue("dark");

    const { result } = await renderHook(() => useStyles());

    expect(result.current.card.borderColor).toBe(darkColors.line);
  });

  it("uses the light palette when the color scheme is unknown", async () => {
    jest.mocked(useColorScheme).mockReturnValue("unspecified");

    const { result } = await renderHook(() => useStyles());

    expect(result.current.card.borderColor).toBe(lightColors.line);
  });

  it("returns the same styles across renders", async () => {
    jest.mocked(useColorScheme).mockReturnValue("dark");

    const { result, rerender } = await renderHook(() => useStyles());
    const firstStyles = result.current;
    await rerender({});

    expect(result.current).toBe(firstStyles);
  });
});
