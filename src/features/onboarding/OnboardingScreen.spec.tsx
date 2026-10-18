import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { AppState, type AppStateStatus, Linking } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  getPermissionStatus,
  type PermissionStatus,
  requestPermission,
} from "@/features/notifications/notifications";

import { OnboardingScreen } from "./OnboardingScreen";
import { useOnboardingStore } from "./store/onboardingStore";

jest.mock("@/shared/database/database", () => ({ database: {} }));
jest.mock("@/features/notifications/notifications", () => ({
  getPermissionStatus: jest.fn(),
  requestPermission: jest.fn(),
}));
jest.mock("@/features/notifications/rescheduleReminders", () => ({
  rescheduleReminders: jest.fn(() => Promise.resolve()),
}));
jest.mock("expo-router", () => {
  const { useEffect } = jest.requireActual<typeof import("react")>("react");
  return {
    useFocusEffect: (effect: () => void) => useEffect(effect, [effect]),
    router: { replace: jest.fn() },
  };
});

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

async function press(name: string) {
  await fireEvent.press(screen.getByRole("button", { name }));
}

async function expectStep(title: string, stepNumber: number) {
  expect(await screen.findByRole("header", { name: title })).toBeOnTheScreen();
  expect(screen.getByLabelText(`Étape ${stepNumber} sur 4`)).toBeOnTheScreen();
}

describe("OnboardingScreen", () => {
  let permissionStatus: PermissionStatus;
  let appStateListener: ((state: AppStateStatus) => void) | undefined;

  beforeEach(() => {
    permissionStatus = "undetermined";
    useOnboardingStore.setState({ onboardingDone: false });
    jest.mocked(getPermissionStatus).mockImplementation(() => Promise.resolve(permissionStatus));
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, listener) => {
      appStateListener = listener;
      return { remove: jest.fn() };
    });
    jest.spyOn(Linking, "openSettings").mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("goes through every step and opens the pillbox at the end", async () => {
    await render(<OnboardingScreen />, { wrapper });
    await expectStep("Vos médicaments, regroupés en prises", 1);

    await press("Continuer");
    await expectStep("Un rappel, puis un autre", 2);

    await press("Plus tard");
    await expectStep("Pilbo n'est pas une application médicale", 3);

    await press("J'ai compris");
    await expectStep("Vos données restent sur ce téléphone", 4);

    await press("Créer ma première prise");
    expect(useOnboardingStore.getState().onboardingDone).toBe(true);
    expect(router.replace).toHaveBeenCalledWith("/pillbox");
  });

  it("goes to the next step when the notifications are allowed", async () => {
    jest.mocked(requestPermission).mockImplementation(() => {
      permissionStatus = "granted";
      return Promise.resolve(true);
    });
    await render(<OnboardingScreen />, { wrapper });
    await press("Continuer");

    await press("Autoriser les notifications");

    await expectStep("Pilbo n'est pas une application médicale", 3);
  });

  it("stays on the step when the notifications are refused", async () => {
    jest.mocked(requestPermission).mockImplementation(() => {
      permissionStatus = "denied";
      return Promise.resolve(false);
    });
    await render(<OnboardingScreen />, { wrapper });
    await press("Continuer");

    await press("Autoriser les notifications");

    expect(requestPermission).toHaveBeenCalledTimes(1);
    await expectStep("Un rappel, puis un autre", 2);
  });

  it("goes to the next step when the notifications are enabled in the iOS settings", async () => {
    permissionStatus = "denied";
    await render(<OnboardingScreen />, { wrapper });
    await press("Continuer");
    await press("Autoriser les notifications");
    expect(Linking.openSettings).toHaveBeenCalledTimes(1);
    await expectStep("Un rappel, puis un autre", 2);

    permissionStatus = "granted";
    await act(async () => appStateListener?.("active"));

    await expectStep("Pilbo n'est pas une application médicale", 3);
  });

  it("goes to the next step when the notifications are already allowed", async () => {
    permissionStatus = "granted";
    await render(<OnboardingScreen />, { wrapper });
    await press("Continuer");

    await press("Autoriser les notifications");

    await expectStep("Pilbo n'est pas une application médicale", 3);
    expect(requestPermission).not.toHaveBeenCalled();
  });
});
