import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { useSettingsStore } from "../store/settingsStore";
import { ReminderSoundRow } from "./ReminderSoundRow";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("ReminderSoundRow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSettingsStore.setState({ defaultReminderSound: "chime" });
  });

  it("shows the default reminder sound", async () => {
    await render(<ReminderSoundRow />);

    expect(screen.getByRole("button", { name: "Son par défaut : Sonnette" })).toHaveProp(
      "accessibilityHint",
      "Ouvre le choix du son",
    );
  });

  it("opens the sound choice of the reminders", async () => {
    await render(<ReminderSoundRow />);

    await fireEvent.press(screen.getByRole("button", { name: "Son par défaut : Sonnette" }));

    expect(router.push).toHaveBeenCalledWith({ pathname: "/sound", params: { kind: "reminder" } });
  });
});
