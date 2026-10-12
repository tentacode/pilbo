import { fireEvent, render, screen } from "@testing-library/react-native";
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
const SUMMARY = {
  progress: "0 prise sur 4",
  detail: "prochaine à 12:20",
  accessibilityLabel: "0 prise sur 4, prochaine à 12:20",
};

describe("TodayHeader", () => {
  it("shows the title as a header and the date", async () => {
    await render(<TodayHeader date={DATE} summary={SUMMARY} onAddUnscheduled={jest.fn()} />, {
      wrapper,
    });

    expect(screen.getByRole("header", { name: "Aujourd'hui" })).toBeOnTheScreen();
    expect(screen.getByText("Dimanche 4 octobre")).toBeOnTheScreen();
  });

  it("shows the summary", async () => {
    await render(<TodayHeader date={DATE} summary={SUMMARY} onAddUnscheduled={jest.fn()} />, {
      wrapper,
    });

    expect(screen.getByLabelText("0 prise sur 4, prochaine à 12:20")).toBeOnTheScreen();
  });

  it("hides the summary when there is none", async () => {
    await render(<TodayHeader date={DATE} summary={null} onAddUnscheduled={jest.fn()} />, {
      wrapper,
    });

    expect(screen.queryByText(/prise sur/)).not.toBeOnTheScreen();
  });

  it("calls onAddUnscheduled from the unscheduled button", async () => {
    const onAddUnscheduled = jest.fn();
    await render(<TodayHeader date={DATE} onAddUnscheduled={onAddUnscheduled} />, { wrapper });

    await fireEvent.press(screen.getByRole("button", { name: "Ajouter une prise hors planning" }));

    expect(onAddUnscheduled).toHaveBeenCalledTimes(1);
  });
});
