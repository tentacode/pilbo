import { act, renderHook } from "@testing-library/react-native";

import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { findMedId } from "@/features/stocks/queries/testStocks";
import { saveStock } from "@/features/stocks/queries/saveStock";
import { useLowStockCount } from "./useLowStockCount";

let mockDatabase: Database;
let mockDatabaseListener: (() => void) | undefined;

jest.mock("@/shared/database/database", () => ({
  get database() {
    return mockDatabase;
  },
  subscribeToDatabaseChanges: (listener: () => void) => {
    mockDatabaseListener = listener;
    return () => {
      mockDatabaseListener = undefined;
    };
  },
}));

function setStock(name: string, strength: string, quantity: number) {
  saveStock(mockDatabase, {
    medId: findMedId(mockDatabase, name, strength),
    quantity,
    boxSize: 30,
    lowStockDays: 7,
  });
}

describe("useLowStockCount", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 9, 19, 7, 0));
    mockDatabase = createTestDatabase();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("counts the low stocks", async () => {
    const { result } = await renderHook(() => useLowStockCount());

    expect(result.current).toBe(1);
  });

  it("follows the database changes", async () => {
    const { result } = await renderHook(() => useLowStockCount());

    setStock("Prazépam", "25 mg", 0);
    setStock("Lamictal", "50 mg", 3);
    await act(() => mockDatabaseListener?.());
    expect(result.current).toBe(3);

    setStock("Lithium", "250 mg", 200);
    await act(() => mockDatabaseListener?.());
    expect(result.current).toBe(2);
  });
});
