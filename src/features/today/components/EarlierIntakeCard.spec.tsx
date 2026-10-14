import { render, screen } from "@testing-library/react-native";

import { createIntake } from "@/features/today/utils/testIntakes";
import type { TodayIntake } from "@/features/today/utils/todayTypes";

import { EarlierIntakeCard } from "./EarlierIntakeCard";

function createEarlierIntake(status: "taken" | "skipped", isTakenLate = false): TodayIntake {
  return {
    intake: createIntake(8, 20),
    status,
    minutesFromNow: -60,
    validation: { time: { hour: 9, minute: 5 }, isTakenLate },
  };
}

describe("EarlierIntakeCard", () => {
  it("shows an intake taken on time", async () => {
    await render(<EarlierIntakeCard todayIntake={createEarlierIntake("taken")} />);

    expect(
      screen.getByLabelText("08:20, Pris à 09:05, Lithium 250 mg, quantité 1"),
    ).toBeOnTheScreen();
    expect(screen.getByText("Pris à 09:05")).toBeOnTheScreen();
    expect(screen.getByText("Lithium 250 mg")).toBeOnTheScreen();
  });

  it("shows an intake taken late", async () => {
    await render(<EarlierIntakeCard todayIntake={createEarlierIntake("taken", true)} />);

    expect(
      screen.getByLabelText("08:20, Pris en retard à 09:05, Lithium 250 mg, quantité 1"),
    ).toBeOnTheScreen();
    expect(screen.getByText("Pris en retard à 09:05")).toBeOnTheScreen();
  });

  it("shows a skipped intake without any button", async () => {
    await render(<EarlierIntakeCard todayIntake={createEarlierIntake("skipped")} />);

    expect(screen.getByLabelText("08:20, Ignorée, Lithium 250 mg, quantité 1")).toBeOnTheScreen();
    expect(screen.getByText("Ignorée")).toBeOnTheScreen();
    expect(screen.queryByRole("button")).not.toBeOnTheScreen();
  });
});
