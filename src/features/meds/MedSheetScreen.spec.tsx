import { fireEvent, render, screen } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { medLogTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";
import type { Database } from "@/shared/database/types";
import { renderInEnglish } from "@/shared/i18n/testHelpers";

import { rescheduleReminders } from "@/features/notifications/rescheduleReminders";
import { getAllMeds } from "@/features/pillbox/queries/getAllMeds";
import { getStockByMedId } from "@/features/stocks/queries/getStockByMedId";
import { saveStock } from "@/features/stocks/queries/saveStock";
import { findMedId } from "@/features/stocks/queries/testStocks";
import { insertMedLog } from "@/features/today/queries/insertMedLog";
import { MedSheetScreen } from "./MedSheetScreen";

let mockDatabase: Database;
let mockSearchParams: { medId?: string } = {};

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
}));
jest.mock("@/features/notifications/rescheduleReminders", () => ({
  rescheduleReminders: jest.fn(() => Promise.resolve()),
}));
jest.mock("expo-router", () => {
  const { useEffect } = jest.requireActual<typeof import("react")>("react");
  return {
    router: { push: jest.fn(), navigate: jest.fn(), back: jest.fn() },
    useLocalSearchParams: () => mockSearchParams,
    useFocusEffect: (effect: () => void) => useEffect(effect, [effect]),
  };
});

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

const TAKE = "Prendre 1 comprimé";

async function renderSheet(name: string, strength: string) {
  jest.setSystemTime(new Date(2026, 9, 19, 7, 0));
  mockSearchParams = { medId: findMedId(mockDatabase, name, strength) };
  await render(<MedSheetScreen />, { wrapper });
  return mockSearchParams.medId as string;
}

function stockOf(medId: string): number | undefined {
  return getStockByMedId(mockDatabase, medId)?.stock.quantity;
}

async function press(name: string | RegExp) {
  await fireEvent.press(screen.getByRole("button", { name }));
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  mockDatabase = createTestDatabase();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("MedSheetScreen", () => {
  describe("display", () => {
    it("shows a med without schedule, with its stock", async () => {
      await renderSheet("Prazépam", "25 mg");

      expect(screen.getByRole("header", { name: "Prazépam 25 mg" })).toBeOnTheScreen();
      expect(screen.getByText("Si besoin")).toBeOnTheScreen();
      expect(
        screen.getByRole("button", {
          name: "Stock : 15 comprimés, Pas d’estimation en jours : ce médicament n’est pas planifié",
        }),
      ).toBeOnTheScreen();
      expect(screen.queryByRole("header", { name: "Dans le pilulier" })).not.toBeOnTheScreen();
      expect(screen.queryByRole("button", { name: /aujourd’hui|Dernière prise/ })).toBeNull();
    });

    it("shows a scheduled med with a low stock and its intakes", async () => {
      await renderSheet("Lithium", "250 mg");

      expect(
        screen.getByRole("button", {
          name: "Stock bas : 4 jours, jusqu’au 22 octobre, 18 comprimés",
        }),
      ).toBeOnTheScreen();
      expect(screen.getByRole("header", { name: "Dans le pilulier" })).toBeOnTheScreen();
      expect(
        screen.getByRole("button", { name: "08:20, Tous les jours · 1 comprimé" }),
      ).toBeOnTheScreen();
      expect(
        screen.getByRole("button", { name: "20:20, Tous les jours · 2 comprimés" }),
      ).toBeOnTheScreen();
    });

    it("offers to track the stock of a med without stock", async () => {
      const medId = await renderSheet("Quviviq", "50 mg");

      await press("Suivre le stock");

      expect(router.push).toHaveBeenCalledWith({ pathname: "/stock", params: { medId } });
    });

    it("shows the last taking of a previous day and opens that day", async () => {
      insertMedLog(
        mockDatabase,
        findMedId(mockDatabase, "Prazépam", "25 mg"),
        new Date(2026, 9, 18, 15, 40),
      );
      await renderSheet("Prazépam", "25 mg");

      await press("Dernière prise : hier à 15:40");

      expect(router.push).toHaveBeenCalledWith({
        pathname: "/day/[date]",
        params: { date: "2026-10-18" },
      });
    });

    it("opens the appearance, the edition and the intakes", async () => {
      const medId = await renderSheet("Lithium", "250 mg");

      await press("Modifier l’apparence de la pilule");
      await press("Modifier le médicament");
      await press("08:20, Tous les jours · 1 comprimé");

      expect(router.push).toHaveBeenCalledWith({ pathname: "/med-appearance", params: { medId } });
      expect(router.push).toHaveBeenCalledWith({ pathname: "/med", params: { medId } });
      expect(router.push).toHaveBeenCalledWith({
        pathname: "/intake",
        params: { intakeId: expect.any(String) },
      });
    });

    it("goes back to the list when the med does not exist anymore", async () => {
      mockSearchParams = { medId: "unknown" };
      await render(<MedSheetScreen />, { wrapper });

      expect(router.navigate).toHaveBeenCalledWith("/meds");
    });
  });

  describe("taking", () => {
    it("takes a pill of a med without schedule", async () => {
      const medId = await renderSheet("Prazépam", "25 mg");

      await press(TAKE);

      expect(stockOf(medId)).toBe(14);
      expect(countRows(mockDatabase, medLogTable)).toBe(1);
      expect(screen.getByText("1 comprimé aujourd’hui · à 07:00")).toBeOnTheScreen();
      expect(screen.getByRole("button", { name: "Annuler la prise de 07:00" })).toBeOnTheScreen();
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Success,
      );
      expect(rescheduleReminders).toHaveBeenCalledTimes(1);
    });

    it("asks before taking a scheduled med", async () => {
      const medId = await renderSheet("Lithium", "250 mg");

      await press(TAKE);
      expect(
        screen.getByText("Ce médicament est prévu dans les prises de 08:20, 12:20 et 20:20."),
      ).toBeOnTheScreen();
      await press("Annuler");
      expect(countRows(mockDatabase, medLogTable)).toBe(0);

      await press(TAKE);
      await press("Prendre quand même");

      expect(countRows(mockDatabase, medLogTable)).toBe(1);
      expect(stockOf(medId)).toBe(17);
    });

    it("undoes the takings of the visit one by one", async () => {
      const medId = await renderSheet("Prazépam", "25 mg");
      await press(TAKE);
      jest.setSystemTime(new Date(2026, 9, 19, 7, 5));
      await press(TAKE);
      expect(stockOf(medId)).toBe(13);
      expect(screen.getByText("2 comprimés aujourd’hui · dernier à 07:05")).toBeOnTheScreen();

      await press("Annuler la prise de 07:05");

      expect(stockOf(medId)).toBe(14);
      expect(screen.getByText("1 comprimé aujourd’hui · à 07:00")).toBeOnTheScreen();
      await press("Annuler la prise de 07:00");

      expect(stockOf(medId)).toBe(15);
      expect(countRows(mockDatabase, medLogTable)).toBe(0);
      expect(screen.queryByRole("button", { name: /^Annuler la prise/ })).toBeNull();
      expect(screen.queryByText(/aujourd’hui/)).toBeNull();
    });

    it("warns when the stock goes below zero and opens the stock", async () => {
      const medId = findMedId(mockDatabase, "Prazépam", "25 mg");
      saveStock(mockDatabase, { medId, quantity: 0, boxSize: 20, lowStockDays: 7 });
      await renderSheet("Prazépam", "25 mg");

      await press(TAKE);
      expect(screen.getByRole("header", { name: "Stock à mettre à jour" })).toBeOnTheScreen();
      await press("Voir le stock");

      expect(router.push).toHaveBeenCalledWith({ pathname: "/stock", params: { medId } });
      expect(screen.queryByRole("header", { name: "Stock à mettre à jour" })).toBeNull();
    });
  });

  describe("archiving", () => {
    it("archives a med without intake after confirmation", async () => {
      const medId = await renderSheet("Prazépam", "25 mg");

      await press("Supprimer le médicament");
      expect(screen.getByRole("header", { name: "Supprimer ce médicament ?" })).toBeOnTheScreen();
      await press("Supprimer");

      expect(getAllMeds(mockDatabase).map(({ id }) => id)).not.toContain(medId);
      expect(stockOf(medId)).toBeUndefined();
      expect(router.navigate).toHaveBeenCalledWith("/meds");
      expect(rescheduleReminders).toHaveBeenCalledTimes(1);
    });

    it("refuses to archive a med of an active intake", async () => {
      const medId = await renderSheet("Lamictal", "50 mg");

      await press("Supprimer le médicament");
      await press("Supprimer");

      expect(
        screen.getByText(
          "Ce médicament est dans la prise de 08:20. Retirez-le du pilulier d’abord.",
        ),
      ).toBeOnTheScreen();
      expect(getAllMeds(mockDatabase).map(({ id }) => id)).toContain(medId);
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  it("is translated in English", async () => {
    jest.setSystemTime(new Date(2026, 9, 19, 7, 0));
    mockSearchParams = { medId: findMedId(mockDatabase, "Prazépam", "25 mg") };
    await renderInEnglish(<MedSheetScreen />, { wrapper });

    expect(screen.getByRole("button", { name: "Take 1 pill" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Delete the medication" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Meds" })).toBeOnTheScreen();
  });
});
