import { fireEvent, render, screen } from "@testing-library/react-native";

import { createIntake } from "@/features/today/utils/testIntakes";

import { LaterIntakeCard } from "./LaterIntakeCard";

const TODAY_INTAKE = {
  intake: createIntake(20, 20),
  status: "later",
  minutesFromNow: 300,
} as const;

describe("LaterIntakeCard", () => {
  it("shows the time, the upcoming status and the meds", async () => {
    await render(<LaterIntakeCard todayIntake={TODAY_INTAKE} onTake={jest.fn()} />);

    expect(screen.getByLabelText("20:20, À venir")).toBeOnTheScreen();
    expect(screen.getByText("À venir")).toBeOnTheScreen();
    expect(screen.getByLabelText("Lithium 250 mg, quantité 1")).toBeOnTheScreen();
  });

  it("takes the intake without a skip button", async () => {
    const onTake = jest.fn();
    await render(<LaterIntakeCard todayIntake={TODAY_INTAKE} onTake={onTake} />);

    await fireEvent.press(screen.getByRole("button", { name: "Prendre la prise de 20:20" }));

    expect(screen.getByText("Prendre en avance")).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Ignorer/ })).not.toBeOnTheScreen();
    expect(onTake).toHaveBeenCalledWith("intake-20-20");
  });
});
