import { fireEvent, render, screen } from "@testing-library/react-native";

import { useSettingsStore } from "../store/settingsStore";
import { DefaultIntervalRow } from "./DefaultIntervalRow";

describe("DefaultIntervalRow", () => {
  beforeEach(() => {
    useSettingsStore.setState({ defaultReminderIntervalMinutes: 10 });
  });

  it("shows the default reminder interval", async () => {
    await render(<DefaultIntervalRow />);

    expect(screen.getByLabelText("Intervalle par défaut des rappels")).toHaveProp(
      "accessibilityRole",
      "radiogroup",
    );
    expect(screen.getByRole("radio", { name: "10 minutes" })).toBeSelected();
  });

  it("changes the default reminder interval", async () => {
    await render(<DefaultIntervalRow />);

    await fireEvent.press(screen.getByRole("radio", { name: "30 minutes" }));

    expect(useSettingsStore.getState().defaultReminderIntervalMinutes).toBe(30);
    expect(screen.getByRole("radio", { name: "30 minutes" })).toBeSelected();
  });
});
