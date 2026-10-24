import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { renderInEnglish } from "@/shared/i18n/testHelpers";

import { NotMedicalScreen } from "./NotMedicalScreen";

jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

describe("NotMedicalScreen", () => {
  it("shows the not medical step without the progress", async () => {
    await render(<NotMedicalScreen />, { wrapper });

    expect(
      screen.getByRole("header", { name: "Pilbo n'est pas une application médicale" }),
    ).toBeOnTheScreen();
    expect(screen.getByText(/ne remplace pas l'avis de votre médecin/)).toBeOnTheScreen();
    expect(screen.queryByLabelText(/^Étape/)).not.toBeOnTheScreen();
  });

  it("goes back to the settings", async () => {
    await render(<NotMedicalScreen />, { wrapper });

    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));

    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("is translated in English", async () => {
    await renderInEnglish(<NotMedicalScreen />, { wrapper });

    expect(screen.getByRole("header", { name: "Pilbo is not a medical app" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Back" })).toBeOnTheScreen();
  });
});
