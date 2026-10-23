import { fireEvent, render, screen } from "@testing-library/react-native";

import { useSettingsStore } from "../store/settingsStore";
import { LowStockRow } from "./LowStockRow";

describe("LowStockRow", () => {
  beforeEach(() => {
    useSettingsStore.setState({ lowStockDays: 7 });
  });

  it("shows the low stock days", async () => {
    await render(<LowStockRow />);

    expect(
      screen.getByRole("adjustable", { name: "Stock bas par défaut" }),
    ).toHaveAccessibilityValue({
      text: "7 jours",
    });
  });

  it("adds and removes a day", async () => {
    await render(<LowStockRow />);

    await fireEvent.press(screen.getByRole("button", { name: "Un jour de plus" }));
    expect(useSettingsStore.getState().lowStockDays).toBe(8);

    await fireEvent.press(screen.getByRole("button", { name: "Un jour de moins" }));
    await fireEvent.press(screen.getByRole("button", { name: "Un jour de moins" }));
    expect(useSettingsStore.getState().lowStockDays).toBe(6);
  });

  it.each([
    [1, "Un jour de moins"],
    [30, "Un jour de plus"],
  ])("is bounded at %i days", async (days, buttonName) => {
    useSettingsStore.setState({ lowStockDays: days });

    await render(<LowStockRow />);

    expect(screen.getByRole("button", { name: buttonName })).toBeDisabled();
  });
});
