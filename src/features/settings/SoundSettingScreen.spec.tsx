import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";
import { getAllIntakes } from "@/features/pillbox/queries/getAllIntakes";
import { setAllActiveIntakesSound } from "@/features/pillbox/queries/setAllActiveIntakesSound";

import { useSettingsStore } from "./store/settingsStore";
import { SoundSettingScreen } from "./SoundSettingScreen";

let mockDatabase: Database;
let mockKind: string | undefined;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
  useLocalSearchParams: () => ({ kind: mockKind }),
}));
jest.mock("@/features/notifications/rescheduleReminders", () => ({
  rescheduleReminders: jest.fn(() => Promise.resolve()),
}));
jest.mock("@/features/notifications/hooks/useSoundPreview", () => ({
  useSoundPreview: () => ({ play: jest.fn() }),
}));

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

async function chooseSound(name: string) {
  await render(<SoundSettingScreen />, { wrapper });
  await fireEvent.press(screen.getByRole("radio", { name }));
  await fireEvent.press(screen.getByRole("button", { name: "Valider" }));
}

function intakeSounds(): string[] {
  return getAllIntakes(mockDatabase).map(({ sound }) => sound);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockDatabase = createTestDatabase();
  useSettingsStore.setState({ defaultReminderSound: "beep", lowStockSound: "beep" });
});

describe("SoundSettingScreen", () => {
  describe("low stock alerts", () => {
    beforeEach(() => {
      mockKind = "lowStock";
    });

    it("saves the sound of the alerts, reschedules and closes", async () => {
      await render(<SoundSettingScreen />, { wrapper });
      expect(screen.getByRole("header", { name: "Son des alertes" })).toBeOnTheScreen();

      await fireEvent.press(screen.getByRole("radio", { name: "Glissade" }));
      await fireEvent.press(screen.getByRole("button", { name: "Valider" }));

      expect(useSettingsStore.getState().lowStockSound).toBe("drop");
      expect(rescheduleReminders).toHaveBeenCalledTimes(1);
      expect(router.back).toHaveBeenCalledTimes(1);
    });
  });

  describe("default reminder sound", () => {
    beforeEach(() => {
      mockKind = "reminder";
    });

    it("closes without asking when every intake has the new sound", async () => {
      setAllActiveIntakesSound(mockDatabase, "chime");

      await chooseSound("Sonnette");

      expect(useSettingsStore.getState().defaultReminderSound).toBe("chime");
      expect(
        screen.queryByRole("header", { name: "Appliquer à toutes les prises ?" }),
      ).not.toBeOnTheScreen();
      expect(rescheduleReminders).toHaveBeenCalledTimes(1);
      expect(router.back).toHaveBeenCalledTimes(1);
    });

    it("asks when an intake has another sound", async () => {
      await chooseSound("Sonnette");

      expect(
        screen.getByRole("header", { name: "Appliquer à toutes les prises ?" }),
      ).toBeOnTheScreen();
      expect(useSettingsStore.getState().defaultReminderSound).toBe("chime");
      expect(router.back).not.toHaveBeenCalled();
    });

    it("applies the sound to every intake", async () => {
      await chooseSound("Sonnette");

      await fireEvent.press(screen.getByRole("button", { name: "Toutes les prises" }));

      expect(intakeSounds()).toEqual(Array(4).fill("chime"));
      expect(rescheduleReminders).toHaveBeenCalledTimes(1);
      expect(router.back).toHaveBeenCalledTimes(1);
    });

    it("keeps the sounds of the intakes for the new intakes only", async () => {
      await chooseSound("Sonnette");

      await fireEvent.press(screen.getByRole("button", { name: "Nouvelles prises uniquement" }));

      expect(intakeSounds()).toEqual(["beep", "beep", "beep", "nocturne"]);
      expect(useSettingsStore.getState().defaultReminderSound).toBe("chime");
      expect(router.back).toHaveBeenCalledTimes(1);
    });
  });
});
