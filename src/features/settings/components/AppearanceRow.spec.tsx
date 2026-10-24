import { fireEvent, render, screen } from "@testing-library/react-native";
import { useColorScheme } from "react-native";

import { useSettingsStore } from "../store/settingsStore";
import { AppearanceRow } from "./AppearanceRow";

jest.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("AppearanceRow", () => {
  beforeEach(() => {
    useSettingsStore.setState({ colorScheme: null });
    jest.mocked(useColorScheme).mockReturnValue("light");
  });

  it("follows the system color scheme by default", async () => {
    jest.mocked(useColorScheme).mockReturnValue("dark");

    await render(<AppearanceRow />);

    expect(screen.getByRole("radio", { name: "Sombre" })).toBeSelected();
  });

  it("changes the color scheme", async () => {
    await render(<AppearanceRow />);

    await fireEvent.press(screen.getByRole("radio", { name: "Sombre" }));

    expect(useSettingsStore.getState().colorScheme).toBe("dark");
    expect(screen.getByRole("radio", { name: "Sombre" })).toBeSelected();
  });

  it("is labelled for assistive technologies", async () => {
    await render(<AppearanceRow />);

    expect(screen.getByLabelText("Apparence")).toHaveProp("accessibilityRole", "radiogroup");
    expect(screen.getByRole("radio", { name: "Clair" })).toBeSelected();
  });
});
