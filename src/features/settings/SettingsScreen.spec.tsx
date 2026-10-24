import { fireEvent, render, screen } from "@testing-library/react-native";
import { getLocales } from "expo-localization";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { DEBUG_MODE_PRESS_COUNT } from "./hooks/useDebugModeToggle";
import { useI18nLanguageSync } from "./hooks/useI18nLanguageSync";
import { SettingsScreen } from "./SettingsScreen";
import { useSettingsStore } from "./store/settingsStore";

jest.mock("@/shared/database/database", () => ({ database: {} }));
jest.mock("@/features/notifications/hooks/useNotificationPermission", () => ({
  useNotificationPermission: () => ({ isGranted: false, request: jest.fn() }),
}));
jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));
jest.mock("expo-localization", () => ({ getLocales: jest.fn() }));
jest.mock("expo-application", () => ({
  nativeApplicationVersion: "1.0.0",
  nativeBuildVersion: "12",
}));

const SECTION_TITLES = ["Rappels", "Stock", "Affichage", "Vos données", "À propos"];

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function Wrapper({ children }: { children: ReactNode }) {
  useI18nLanguageSync();
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

async function pressVersion(times: number) {
  for (let index = 0; index < times; index += 1) {
    await fireEvent.press(screen.getByLabelText("Version 1.0.0 (12)"));
  }
}

describe("SettingsScreen", () => {
  beforeEach(() => {
    useSettingsStore.setState({ language: null });
    jest
      .mocked(getLocales)
      .mockReturnValue([{ languageCode: "fr" } as ReturnType<typeof getLocales>[0]]);
  });

  it("shows every section", async () => {
    await render(<SettingsScreen />, { wrapper: Wrapper });

    for (const title of SECTION_TITLES) {
      expect(screen.getByRole("header", { name: title })).toBeOnTheScreen();
    }
  });

  it("shows the title in the app language", async () => {
    await render(<SettingsScreen />, { wrapper: Wrapper });

    expect(screen.getByRole("header", { name: "Réglages" })).toBeOnTheScreen();
  });

  it("translates the title as soon as the language changes", async () => {
    await render(<SettingsScreen />, { wrapper: Wrapper });

    await fireEvent.press(screen.getByRole("radio", { name: "English" }));

    expect(screen.getByRole("header", { name: "Settings" })).toBeOnTheScreen();
  });

  it("hides the debug section by default", async () => {
    await render(<SettingsScreen />, { wrapper: Wrapper });

    expect(screen.queryByRole("header", { name: "Debug" })).not.toBeOnTheScreen();
  });

  it("toggles the debug section with 10 presses on the version", async () => {
    await render(<SettingsScreen />, { wrapper: Wrapper });

    await pressVersion(DEBUG_MODE_PRESS_COUNT);

    expect(screen.getByRole("header", { name: "Debug" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Supprimer les données" })).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Réinitialiser avec des données de test" }),
    ).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Simuler une erreur" })).toBeOnTheScreen();

    await pressVersion(DEBUG_MODE_PRESS_COUNT);

    expect(screen.queryByRole("header", { name: "Debug" })).not.toBeOnTheScreen();
  });

  it("translates every section as soon as the language changes", async () => {
    await render(<SettingsScreen />, { wrapper: Wrapper });

    await fireEvent.press(screen.getByRole("radio", { name: "English" }));

    for (const title of ["Reminders", "Stock", "Display", "Your data", "About"]) {
      expect(screen.getByRole("header", { name: title })).toBeOnTheScreen();
    }
    expect(screen.getByRole("button", { name: "Pilbo is not a medical app" })).toBeOnTheScreen();
    expect(screen.getByLabelText("Version 1.0.0 (12)")).toBeOnTheScreen();
  });
});
