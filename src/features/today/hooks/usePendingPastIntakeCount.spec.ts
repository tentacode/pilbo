import { act, renderHook } from "@testing-library/react-native";
import { sql } from "drizzle-orm";

import { intakeLogTable, intakeTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { usePendingPastIntakeCount } from "./usePendingPastIntakeCount";

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

function logIntakeOf(hour: number) {
  const [{ id, minute }] = mockDatabase.all<{ id: string; minute: number }>(sql`
    SELECT ${intakeTable.id} AS id, ${intakeTable.minute} AS minute
    FROM ${intakeTable}
    WHERE ${intakeTable.hour} = ${hour}
  `);
  const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  mockDatabase
    .insert(intakeLogTable)
    .values({
      intakeId: id,
      expectedIntakeAt: `2026-10-04T${time}`,
      createdAt: `2026-10-04T${time}`,
      status: "taken",
    })
    .run();
}

describe("usePendingPastIntakeCount", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockDatabase = createTestDatabase();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("is 0 before the first intake", async () => {
    jest.setSystemTime(new Date(2026, 9, 4, 7, 0));

    const { result } = await renderHook(() => usePendingPastIntakeCount());

    expect(result.current).toBe(0);
  });

  it("counts an intake once its time is reached", async () => {
    jest.setSystemTime(new Date(2026, 9, 4, 8, 19, 30));
    const { result } = await renderHook(() => usePendingPastIntakeCount());
    expect(result.current).toBe(0);

    await act(() => jest.advanceTimersByTime(30_000));

    expect(result.current).toBe(1);
  });

  it("decreases when the database changes after a validation", async () => {
    jest.setSystemTime(new Date(2026, 9, 4, 8, 30));
    const { result } = await renderHook(() => usePendingPastIntakeCount());
    expect(result.current).toBe(1);

    logIntakeOf(8);
    await act(() => mockDatabaseListener?.());

    expect(result.current).toBe(0);
  });
});
