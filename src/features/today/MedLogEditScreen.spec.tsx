import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { medLogTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";
import type { Database } from "@/shared/database/types";

import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";
import { getStockByMedId } from "@/features/stocks/queries/getStockByMedId";
import { findMedId } from "@/features/stocks/queries/testStocks";
import { getMedLogById } from "./queries/getMedLogById";
import { insertMedLog } from "./queries/insertMedLog";
import { MedLogEditScreen } from "./MedLogEditScreen";

let mockDatabase: Database;
let mockSearchParams: { medLogId?: string } = {};
const mockParentNavigation = { goBack: jest.fn(), setOptions: jest.fn() };
const mockNavigation = { getParent: () => mockParentNavigation, dispatch: jest.fn() };
const mockPreventRemove = { isPrevented: false };

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
  usePreventRemove: (isPrevented: boolean) => {
    mockPreventRemove.isPrevented = isPrevented;
  },
}));

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

function prazepamId(): string {
  return findMedId(mockDatabase, "Prazépam", "25 mg");
}

async function renderScreen() {
  const medLogId = insertMedLog(mockDatabase, prazepamId(), new Date(2026, 10, 4, 15, 40));
  mockSearchParams = { medLogId };
  await render(<MedLogEditScreen />, { wrapper });
  return medLogId;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockDatabase = createTestDatabase();
});

describe("MedLogEditScreen", () => {
  it("shows the med, the day and the time of the free taking", async () => {
    await renderScreen();

    expect(screen.getByRole("header", { name: "Prise de 15:40" })).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Prazépam 25 mg" })).toBeOnTheScreen();
    expect(screen.getByText("Mercredi 4 novembre")).toBeOnTheScreen();
    expect(screen.getByTestId("date-picker").props.modifiers).toContainEqual({
      accessibilityLabel: "Heure de prise : 15:40",
    });
  });

  it("changes the time and keeps the day", async () => {
    const medLogId = await renderScreen();

    await fireEvent(screen.getByTestId("date-picker"), "dateChange", new Date(2026, 0, 1, 11, 20));
    expect(mockPreventRemove.isPrevented).toBe(true);
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

    expect(getMedLogById(mockDatabase, medLogId)?.takenAt).toBe("2026-11-04T11:20");
    expect(mockParentNavigation.goBack).toHaveBeenCalledTimes(1);
    expect(rescheduleReminders).toHaveBeenCalledTimes(1);
  });

  it("deletes the taking without confirmation and gives back the pill", async () => {
    await renderScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Supprimer cette prise" }));

    expect(countRows(mockDatabase, medLogTable)).toBe(0);
    expect(getStockByMedId(mockDatabase, prazepamId())?.stock.quantity).toBe(16);
    expect(mockParentNavigation.goBack).toHaveBeenCalledTimes(1);
    expect(rescheduleReminders).toHaveBeenCalledTimes(1);
  });

  it("renders nothing for an unknown taking", async () => {
    mockSearchParams = { medLogId: "unknown" };
    await render(<MedLogEditScreen />, { wrapper });

    expect(screen.queryByRole("button", { name: "Enregistrer" })).not.toBeOnTheScreen();
  });
});
