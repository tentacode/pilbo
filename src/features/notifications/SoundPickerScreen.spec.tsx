import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SoundPickerScreen } from "./SoundPickerScreen";

const mockPlay = jest.fn();

jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));
jest.mock("./hooks/useSoundPreview", () => ({
  useSoundPreview: () => ({ play: mockPlay }),
}));

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

const onConfirm = jest.fn();

function renderPicker() {
  return render(<SoundPickerScreen title="Son" initialSound="beep" onConfirm={onConfirm} />, {
    wrapper,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("SoundPickerScreen", () => {
  it("lists the sounds in order, with the initial sound checked", async () => {
    await renderPicker();

    expect(screen.getAllByRole("radio").map((option) => option.props.accessibilityLabel)).toEqual([
      "Beep Boop",
      "Beep Boop Beep Boop",
      "Sonnette",
      "Glissade",
      "Secoue ton pilbo",
      "Fantôme",
      "Nocturne",
      "Pilbo Sacquet",
      "Vibration seule",
    ]);
    expect(screen.getByRole("radio", { name: "Beep Boop Beep Boop", checked: true })).toBeTruthy();
    expect(screen.getAllByRole("radio", { checked: false })).toHaveLength(8);
  });

  it("explains that a press plays the sound", async () => {
    await renderPicker();

    expect(screen.getByRole("radio", { name: "Sonnette" }).props.accessibilityHint).toBe(
      "Joue le son",
    );
    expect(screen.getByRole("radio", { name: "Vibration seule" }).props.accessibilityHint).toBe(
      "Fait vibrer le téléphone",
    );
  });

  it("selects and plays the pressed sound", async () => {
    await renderPicker();

    await fireEvent.press(screen.getByRole("radio", { name: "Sonnette" }));

    expect(mockPlay).toHaveBeenCalledWith("chime");
    expect(screen.getByRole("radio", { name: "Sonnette", checked: true })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Beep Boop Beep Boop", checked: false })).toBeTruthy();
  });

  it("confirms the selected sound", async () => {
    await renderPicker();

    await fireEvent.press(screen.getByRole("radio", { name: "Vibration seule" }));
    await fireEvent.press(screen.getByRole("button", { name: "Valider" }));

    expect(onConfirm).toHaveBeenCalledWith("vibration");
  });

  it("goes back without confirming on cancel", async () => {
    await renderPicker();

    await fireEvent.press(screen.getByRole("radio", { name: "Sonnette" }));
    await fireEvent.press(screen.getByRole("button", { name: "Annuler" }));

    expect(router.back).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
