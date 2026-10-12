import { fireEvent, render, screen } from "@testing-library/react-native";

import { createIntake } from "@/features/today/utils/testIntakes";

import { LateIntakeCard } from "./LateIntakeCard";

const TODAY_INTAKE = { intake: createIntake(12, 20), status: "late", minutesFromNow: -40 } as const;

describe("LateIntakeCard", () => {
  it("shows the time, the late status and the meds", async () => {
    await render(
      <LateIntakeCard todayIntake={TODAY_INTAKE} onTake={jest.fn()} onSkip={jest.fn()} />,
    );

    expect(screen.getByLabelText("12:20, En retard de 40 minutes")).toBeOnTheScreen();
    expect(screen.getByText("12:20")).toBeOnTheScreen();
    expect(screen.getByText("En retard · 40 min")).toBeOnTheScreen();
    expect(screen.getByLabelText("Lithium 250 mg, quantité 1")).toBeOnTheScreen();
  });

  it("takes the intake", async () => {
    const onTake = jest.fn();
    await render(<LateIntakeCard todayIntake={TODAY_INTAKE} onTake={onTake} onSkip={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Prendre la prise de 12:20" }));

    expect(screen.getByText("Je l'ai pris")).toBeOnTheScreen();
    expect(onTake).toHaveBeenCalledWith("intake-12-20");
  });

  it("skips the intake", async () => {
    const onSkip = jest.fn();
    await render(<LateIntakeCard todayIntake={TODAY_INTAKE} onTake={jest.fn()} onSkip={onSkip} />);

    await fireEvent.press(screen.getByRole("button", { name: "Ignorer la prise de 12:20" }));

    expect(onSkip).toHaveBeenCalledWith("intake-12-20");
  });
});
