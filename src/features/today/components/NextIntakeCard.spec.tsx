import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createIntake } from "@/features/today/utils/testIntakes";
import type { TodayIntake } from "@/features/today/utils/todayTypes";

import { NextIntakeCard } from "./NextIntakeCard";

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

function createTodayIntake(minutesFromNow: number): TodayIntake {
  return { intake: createIntake(12, 20), status: "next", minutesFromNow };
}

describe("NextIntakeCard", () => {
  it("shows the time, the remaining duration and the meds", async () => {
    await render(
      <NextIntakeCard
        todayIntake={createTodayIntake(145)}
        onTake={jest.fn()}
        onNotTaken={jest.fn()}
      />,
    );

    expect(screen.getByLabelText("12:20, Dans 2 heures 25 minutes")).toBeOnTheScreen();
    expect(screen.getByText("Dans 2 h 25")).toBeOnTheScreen();
    expect(screen.getByLabelText("Lithium 250 mg, quantité 1")).toBeOnTheScreen();
  });

  it("tells when it is time", async () => {
    await render(
      <NextIntakeCard
        todayIntake={createTodayIntake(-10)}
        onTake={jest.fn()}
        onNotTaken={jest.fn()}
      />,
    );

    expect(screen.getByText("C'est l'heure")).toBeOnTheScreen();
  });

  it("takes the intake or marks it as forgotten", async () => {
    const onTake = jest.fn();
    const onNotTaken = jest.fn();
    await render(
      <NextIntakeCard
        todayIntake={createTodayIntake(145)}
        onTake={onTake}
        onNotTaken={onNotTaken}
      />,
      { wrapper },
    );

    await fireEvent.press(screen.getByRole("button", { name: "Prendre la prise de 12:20" }));
    await fireEvent.press(screen.getByRole("button", { name: "Pas pris, prise de 12:20" }));
    await fireEvent.press(screen.getByRole("button", { name: "Je l'ai oublié" }));

    expect(onTake).toHaveBeenCalledWith("intake-12-20");
    expect(onNotTaken).toHaveBeenCalledWith("intake-12-20", "missed");
  });
});
