import { render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TodayHeader } from "./TodayHeader";

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

const DATE = new Date(2026, 9, 4, 10, 0);

describe("TodayHeader", () => {
  it("shows the title as a header and the date", async () => {
    await render(<TodayHeader date={DATE} />, { wrapper });

    expect(screen.getByRole("header", { name: "Aujourd'hui" })).toBeOnTheScreen();
    expect(screen.getByText("Dimanche 4 octobre")).toBeOnTheScreen();
  });
});
