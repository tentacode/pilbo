import { render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SettingsScreen } from "./SettingsScreen";

let mockIsDebugMode = false;

jest.mock("@/config/debug", () => ({
  get IS_DEBUG_MODE() {
    return mockIsDebugMode;
  },
}));
jest.mock("@/shared/database/database", () => ({ database: {} }));

const DEBUG_BUTTON_NAMES = ["Simuler une erreur", "Vider la base", "Réinitialiser la base"];

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

describe("SettingsScreen", () => {
  it("shows the debug buttons when debug mode is enabled", async () => {
    mockIsDebugMode = true;

    await render(<SettingsScreen />, { wrapper });

    for (const name of DEBUG_BUTTON_NAMES) {
      expect(screen.getByRole("button", { name })).toBeOnTheScreen();
    }
  });

  it("hides the debug buttons when debug mode is disabled", async () => {
    mockIsDebugMode = false;

    await render(<SettingsScreen />, { wrapper });

    for (const name of DEBUG_BUTTON_NAMES) {
      expect(screen.queryByRole("button", { name })).not.toBeOnTheScreen();
    }
  });
});
