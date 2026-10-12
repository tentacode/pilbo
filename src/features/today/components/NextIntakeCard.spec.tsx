import { fireEvent, render, screen } from "@testing-library/react-native";

import { createIntake } from "@/features/today/utils/testIntakes";
import type { TodayIntake } from "@/features/today/utils/todayTypes";

import { NextIntakeCard } from "./NextIntakeCard";

function createTodayIntake(minutesFromNow: number): TodayIntake {
  return { intake: createIntake(12, 20), status: "next", minutesFromNow };
}

describe("NextIntakeCard", () => {
  it("shows the time, the remaining duration and the meds", async () => {
    await render(
      <NextIntakeCard todayIntake={createTodayIntake(145)} onTake={jest.fn()} onSkip={jest.fn()} />,
    );

    expect(screen.getByLabelText("12:20, Dans 2 heures 25 minutes")).toBeOnTheScreen();
    expect(screen.getByText("Dans 2 h 25")).toBeOnTheScreen();
    expect(screen.getByLabelText("Lithium 250 mg, quantité 1")).toBeOnTheScreen();
  });

  it("tells when it is time", async () => {
    await render(
      <NextIntakeCard todayIntake={createTodayIntake(-10)} onTake={jest.fn()} onSkip={jest.fn()} />,
    );

    expect(screen.getByText("C'est l'heure")).toBeOnTheScreen();
  });

  it("takes and skips the intake", async () => {
    const onTake = jest.fn();
    const onSkip = jest.fn();
    await render(
      <NextIntakeCard todayIntake={createTodayIntake(145)} onTake={onTake} onSkip={onSkip} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Prendre la prise de 12:20" }));
    await fireEvent.press(screen.getByRole("button", { name: "Ignorer la prise de 12:20" }));

    expect(onTake).toHaveBeenCalledWith("intake-12-20");
    expect(onSkip).toHaveBeenCalledWith("intake-12-20");
  });
});
