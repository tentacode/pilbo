import { act, fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";
import { i18n } from "@/shared/i18n/i18n";

import { leaveWithoutConfirmation } from "@/features/pillbox/hooks/useModalClosing";
import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { getStockByMedId } from "./queries/getStockByMedId";
import { saveStock } from "./queries/saveStock";
import { findMedId } from "./queries/testStocks";
import { StockEditScreen } from "./StockEditScreen";

let mockDatabase: Database;
let mockSearchParams: { medId?: string } = {};
const mockParentNavigation = { goBack: jest.fn(), setOptions: jest.fn() };
const mockNavigation = { getParent: () => mockParentNavigation, dispatch: jest.fn() };
const mockPreventRemove: {
  isPrevented: boolean;
  callback?: (options: { data: { action: object } }) => void;
} = { isPrevented: false };

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("@/features/notifications/rescheduleReminders", () => ({
  rescheduleReminders: jest.fn(() => Promise.resolve()),
}));
jest.mock("expo-router", () => ({
  useLocalSearchParams: () => mockSearchParams,
  useNavigation: () => mockNavigation,
}));
jest.mock("expo-router/react-navigation", () => ({
  usePreventRemove: (
    isPrevented: boolean,
    callback: (options: { data: { action: object } }) => void,
  ) => {
    mockPreventRemove.isPrevented = isPrevented;
    mockPreventRemove.callback = callback;
  },
}));

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

async function renderFor(name: string, strength: string) {
  mockSearchParams = { medId: findMedId(mockDatabase, name, strength) };
  await render(<StockEditScreen />, { wrapper });
  return mockSearchParams.medId as string;
}

async function press(name: string) {
  await fireEvent.press(screen.getByRole("button", { name }));
}

function quantityInput() {
  return screen.getByLabelText("Comprimés restants");
}

describe("StockEditScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 9, 19, 7, 0));
    jest.clearAllMocks();
    mockDatabase = createTestDatabase();
    mockPreventRemove.isPrevented = false;
    useSettingsStore.setState({ lowStockDays: 10 });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("creates a stock with the default values", async () => {
    const medId = await renderFor("Quviviq", "50 mg");

    expect(screen.getByRole("header", { name: "Ajouter un stock" })).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Quviviq 50 mg" })).toBeOnTheScreen();
    expect(screen.getByText("1 comprimé par jour · 22:00")).toBeOnTheScreen();
    expect(screen.getByLabelText("0 comprimé, Stock bas, 0 jour, à renouveler")).toBeOnTheScreen();
    expect(screen.getByText("10 jours")).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Ne plus suivre le stock" })).toBeNull();

    await press("Enregistrer");

    expect(getStockByMedId(mockDatabase, medId)?.stock).toEqual({
      medId,
      quantity: 0,
      boxSize: 30,
      lowStockDays: 10,
    });
    expect(mockParentNavigation.goBack).toHaveBeenCalledTimes(1);
    expect(rescheduleReminders).toHaveBeenCalledTimes(1);
  });

  it("updates an existing stock with the steppers and a new box", async () => {
    const medId = await renderFor("Lithium", "250 mg");

    expect(screen.getByRole("header", { name: "Modifier le stock" })).toBeOnTheScreen();
    expect(
      screen.getByLabelText("18 comprimés, Stock bas, 4 jours, jusqu’au 22 octobre"),
    ).toBeOnTheScreen();
    expect(screen.getByText("Soit 28 comprimés pour les 7 prochains jours.")).toBeOnTheScreen();

    await press("Un comprimé de plus");
    await press("Ajouter une boîte de 100");
    await press("Un jour de plus");

    expect(
      screen.getByLabelText("119 comprimés, Suffisant, 29 jours, jusqu’au 16 novembre"),
    ).toBeOnTheScreen();
    expect(screen.getByText("Soit 32 comprimés pour les 8 prochains jours.")).toBeOnTheScreen();

    await press("Enregistrer");

    expect(getStockByMedId(mockDatabase, medId)?.stock).toEqual({
      medId,
      quantity: 119,
      boxSize: 100,
      lowStockDays: 8,
    });
  });

  it("types the remaining pills between 0 and 9999", async () => {
    await renderFor("Lithium", "250 mg");

    await fireEvent(quantityInput(), "focus");
    await fireEvent.changeText(quantityInput(), "250");
    expect(quantityInput()).toHaveDisplayValue("250");

    await fireEvent.changeText(quantityInput(), "99999");
    expect(quantityInput()).toHaveDisplayValue("9999");

    await fireEvent.changeText(quantityInput(), "");
    await fireEvent(quantityInput(), "blur");
    expect(quantityInput()).toHaveDisplayValue("0");
  });

  it("shows a negative stock as it is", async () => {
    const medId = findMedId(mockDatabase, "Lithium", "250 mg");
    saveStock(mockDatabase, { medId, quantity: -3, boxSize: 100, lowStockDays: 7 });
    await renderFor("Lithium", "250 mg");

    expect(quantityInput()).toHaveDisplayValue("-3");
    expect(screen.getByRole("button", { name: "Un comprimé de moins" })).toBeDisabled();

    await press("Un comprimé de plus");

    expect(quantityInput()).toHaveDisplayValue("-2");
  });

  it("refuses an empty or out of range box size", async () => {
    const medId = await renderFor("Lithium", "250 mg");
    const boxSizeInput = screen.getByLabelText("Taille d’une boîte, en comprimés");

    await fireEvent.changeText(boxSizeInput, "0");
    expect(screen.getByRole("button", { name: "Ajouter une boîte" })).toBeDisabled();
    await press("Enregistrer");

    expect(
      screen.getByText("Indiquez une taille de boîte entre 1 et 999 comprimés.", {
        includeHiddenElements: true,
      }),
    ).toBeOnTheScreen();
    expect(getStockByMedId(mockDatabase, medId)?.stock.boxSize).toBe(100);

    await fireEvent.changeText(boxSizeInput, "28");
    expect(
      screen.queryByText("Indiquez une taille de boîte entre 1 et 999 comprimés.", {
        includeHiddenElements: true,
      }),
    ).toBeNull();
    await press("Enregistrer");

    expect(getStockByMedId(mockDatabase, medId)?.stock.boxSize).toBe(28);
  });

  it("hides the threshold for a med without schedule", async () => {
    await renderFor("Prazépam", "25 mg");

    expect(screen.getByLabelText("0 comprimé, Stock bas, Si besoin")).toBeOnTheScreen();
    expect(screen.queryByRole("adjustable", { name: "Me prévenir à" })).toBeNull();
    expect(screen.getByLabelText("Taille d’une boîte, en comprimés")).toBeOnTheScreen();
  });

  it("asks before discarding the changes", async () => {
    await renderFor("Lithium", "250 mg");
    expect(mockPreventRemove.isPrevented).toBe(false);

    await press("Un comprimé de plus");
    expect(mockPreventRemove.isPrevented).toBe(true);

    const action = { type: "GO_BACK" };
    await act(() => mockPreventRemove.callback?.({ data: { action } }));
    expect(
      screen.getByRole("header", { name: "Abandonner les modifications ?" }),
    ).toBeOnTheScreen();

    await press("Abandonner");
    expect(mockNavigation.dispatch).toHaveBeenCalledWith(action);
  });

  it("leaves without confirmation when asked to", async () => {
    await renderFor("Lithium", "250 mg");
    await press("Un comprimé de plus");
    const action = { type: "NAVIGATE" };

    await act(() =>
      leaveWithoutConfirmation(() => mockPreventRemove.callback?.({ data: { action } })),
    );

    expect(mockNavigation.dispatch).toHaveBeenCalledWith(action);
    expect(screen.queryByRole("header", { name: "Abandonner les modifications ?" })).toBeNull();
  });

  it("stops tracking the stock after confirmation", async () => {
    const medId = await renderFor("Lithium", "250 mg");

    await press("Ne plus suivre le stock");
    expect(screen.getByRole("header", { name: "Ne plus suivre ce stock ?" })).toBeOnTheScreen();
    await press("Ne plus suivre");

    expect(getStockByMedId(mockDatabase, medId)).toBeUndefined();
    expect(mockParentNavigation.goBack).toHaveBeenCalledTimes(1);
    expect(rescheduleReminders).toHaveBeenCalledTimes(1);
  });

  it("is translated in English", async () => {
    await i18n.changeLanguage("en");

    await renderFor("Quviviq", "50 mg");

    expect(screen.getByRole("header", { name: "Add a stock" })).toBeOnTheScreen();
    expect(screen.getByText("1 pill a day · 22:00")).toBeOnTheScreen();
    expect(screen.getByLabelText("0 pills, Low stock, 0 days, time to renew")).toBeOnTheScreen();
    expect(screen.getByText("10 days")).toBeOnTheScreen();
  });
});
