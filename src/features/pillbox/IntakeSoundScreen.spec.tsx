import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import { type ReactNode, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { IntakeDraftProvider, useIntakeDraft } from "./hooks/useIntakeDraft";
import { IntakeSoundScreen } from "./IntakeSoundScreen";
import { getAllIntakes } from "./queries/getAllIntakes";

let mockDatabase: Database;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));
jest.mock("@/features/notifications/hooks/useSoundPreview", () => ({
  useSoundPreview: () => ({ play: jest.fn() }),
}));

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

let draftSound: string | undefined;

function DraftSoundSpy() {
  const { draft } = useIntakeDraft();
  useEffect(() => {
    draftSound = draft.sound;
  });
  return null;
}

function renderScreen() {
  const night = getAllIntakes(mockDatabase)[3];
  function wrapper({ children }: { children: ReactNode }) {
    return (
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <IntakeDraftProvider intakeId={night.id}>
          <DraftSoundSpy />
          {children}
        </IntakeDraftProvider>
      </SafeAreaProvider>
    );
  }
  return render(<IntakeSoundScreen />, { wrapper });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockDatabase = createTestDatabase();
});

describe("IntakeSoundScreen", () => {
  it("starts from the sound of the intake", async () => {
    await renderScreen();

    expect(screen.getByRole("header", { name: "Son du rappel" })).toBeOnTheScreen();
    expect(screen.getByRole("radio", { name: "Nocturne", checked: true })).toBeOnTheScreen();
  });

  it("sets the sound of the draft and goes back", async () => {
    await renderScreen();

    await fireEvent.press(screen.getByRole("radio", { name: "Fantôme" }));
    await fireEvent.press(screen.getByRole("button", { name: "Valider" }));

    expect(draftSound).toBe("gentle_alert_resolved");
    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
