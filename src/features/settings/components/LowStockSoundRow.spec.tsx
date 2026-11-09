import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { useSettingsStore } from "../store/settingsStore";
import { LowStockSoundRow } from "./LowStockSoundRow";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("LowStockSoundRow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSettingsStore.setState({ lowStockSound: "vibration" });
  });

  it("shows the low stock sound", async () => {
    await render(<LowStockSoundRow />);

    expect(
      screen.getByRole("button", { name: "Son des alertes : Vibration seule" }),
    ).toBeOnTheScreen();
  });

  it("opens the sound choice of the low stock alerts", async () => {
    await render(<LowStockSoundRow />);

    await fireEvent.press(
      screen.getByRole("button", { name: "Son des alertes : Vibration seule" }),
    );

    expect(router.push).toHaveBeenCalledWith({ pathname: "/sound", params: { kind: "lowStock" } });
  });
});
