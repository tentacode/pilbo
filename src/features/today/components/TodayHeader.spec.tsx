import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import type { DayNavigation } from "@/features/today/hooks/useDayNavigation";
import { TodayHeader } from "./TodayHeader";

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

function createDayNavigation(changes: Partial<DayNavigation> = {}): DayNavigation {
  return {
    today: "2026-10-24",
    displayedDate: "2026-10-24",
    isToday: true,
    previousDate: "2026-10-23",
    nextDate: null,
    showDate: jest.fn(),
    ...changes,
  };
}

const PAST_DAY = {
  displayedDate: "2026-10-21",
  isToday: false,
  previousDate: "2026-10-20",
  nextDate: "2026-10-22",
};

describe("TodayHeader", () => {
  it("shows today with the date and without next day button", async () => {
    await render(<TodayHeader dayNavigation={createDayNavigation()} onOpenCalendar={jest.fn()} />, {
      wrapper,
    });

    expect(screen.getByRole("header", { name: "Aujourd'hui" })).toBeOnTheScreen();
    expect(screen.getByText("24 oct. 2026")).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Jour précédent : vendredi 23 octobre" }),
    ).toBeEnabled();
    expect(screen.queryByRole("button", { name: /^Jour suivant/ })).not.toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Revenir à aujourd'hui" })).not.toBeOnTheScreen();
  });

  it("shows the previous day when the previous button is pressed", async () => {
    const dayNavigation = createDayNavigation();
    await render(<TodayHeader dayNavigation={dayNavigation} onOpenCalendar={jest.fn()} />, {
      wrapper,
    });

    await fireEvent.press(
      screen.getByRole("button", { name: "Jour précédent : vendredi 23 octobre" }),
    );

    expect(dayNavigation.showDate).toHaveBeenCalledWith("2026-10-23");
  });

  it.each([
    ["2026-10-23", "Hier"],
    ["2026-10-22", "Avant-hier"],
    ["2026-10-21", "Mercredi 21 octobre"],
  ])("titles the past day %s as %s", async (displayedDate, title) => {
    await render(
      <TodayHeader
        dayNavigation={createDayNavigation({ ...PAST_DAY, displayedDate })}
        onOpenCalendar={jest.fn()}
      />,
      { wrapper },
    );

    expect(screen.getByRole("header", { name: title })).toBeOnTheScreen();
  });

  it("navigates from a past day to the next day or back to today", async () => {
    const dayNavigation = createDayNavigation(PAST_DAY);
    await render(<TodayHeader dayNavigation={dayNavigation} onOpenCalendar={jest.fn()} />, {
      wrapper,
    });

    await fireEvent.press(screen.getByRole("button", { name: "Jour suivant : jeudi 22 octobre" }));
    await fireEvent.press(screen.getByRole("button", { name: "Revenir à aujourd'hui" }));

    expect(dayNavigation.showDate).toHaveBeenNthCalledWith(1, "2026-10-22");
    expect(dayNavigation.showDate).toHaveBeenNthCalledWith(2, "2026-10-24");
  });

  it("disables the previous day button on the first day of history", async () => {
    await render(
      <TodayHeader
        dayNavigation={createDayNavigation({ ...PAST_DAY, previousDate: null })}
        onOpenCalendar={jest.fn()}
      />,
      { wrapper },
    );

    expect(screen.getByRole("button", { name: /^Jour précédent/ })).toBeDisabled();
  });

  it("opens the calendar", async () => {
    const onOpenCalendar = jest.fn();
    await render(
      <TodayHeader dayNavigation={createDayNavigation()} onOpenCalendar={onOpenCalendar} />,
      { wrapper },
    );

    await fireEvent.press(screen.getByRole("button", { name: "Calendrier" }));

    expect(onOpenCalendar).toHaveBeenCalledTimes(1);
  });
});
