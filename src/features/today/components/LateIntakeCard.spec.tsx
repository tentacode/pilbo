import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createIntake } from "@/features/today/utils/testIntakes";

import { LateIntakeCard } from "./LateIntakeCard";

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

const TODAY_INTAKE = { intake: createIntake(12, 20), status: "late", minutesFromNow: -40 } as const;

describe("LateIntakeCard", () => {
  it("shows the time, the late status and the meds", async () => {
    await render(
      <LateIntakeCard todayIntake={TODAY_INTAKE} onTake={jest.fn()} onNotTaken={jest.fn()} />,
    );

    expect(screen.getByLabelText("12:20, En retard de 40 minutes")).toBeOnTheScreen();
    expect(screen.getByText("12:20")).toBeOnTheScreen();
    expect(screen.getByText("En retard · 40 min")).toBeOnTheScreen();
    expect(screen.getByLabelText("Lithium 250 mg, quantité 1")).toBeOnTheScreen();
  });

  it("takes the intake", async () => {
    const onTake = jest.fn();
    await render(
      <LateIntakeCard todayIntake={TODAY_INTAKE} onTake={onTake} onNotTaken={jest.fn()} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Prendre la prise de 12:20" }));

    expect(screen.getByText("Je l'ai pris")).toBeOnTheScreen();
    expect(onTake).toHaveBeenCalledWith("intake-12-20");
  });

  it.each([
    ["Je l'ai ignoré", "skipped"],
    ["Je l'ai oublié", "missed"],
  ])("marks the intake as not taken with « %s »", async (actionLabel, status) => {
    const onNotTaken = jest.fn();
    await render(
      <LateIntakeCard todayIntake={TODAY_INTAKE} onTake={jest.fn()} onNotTaken={onNotTaken} />,
      { wrapper },
    );

    await fireEvent.press(screen.getByRole("button", { name: "Pas pris, prise de 12:20" }));
    expect(screen.getByRole("header", { name: "Vous ne l'avez pas pris ?" })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: actionLabel }));

    expect(onNotTaken).toHaveBeenCalledWith("intake-12-20", status);
    expect(
      screen.queryByRole("header", { name: "Vous ne l'avez pas pris ?" }),
    ).not.toBeOnTheScreen();
  });

  it("closes the not taken choices without action", async () => {
    const onNotTaken = jest.fn();
    await render(
      <LateIntakeCard todayIntake={TODAY_INTAKE} onTake={jest.fn()} onNotTaken={onNotTaken} />,
      { wrapper },
    );

    await fireEvent.press(screen.getByRole("button", { name: "Pas pris, prise de 12:20" }));
    await fireEvent.press(screen.getByRole("button", { name: "Annuler" }));

    expect(onNotTaken).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("header", { name: "Vous ne l'avez pas pris ?" }),
    ).not.toBeOnTheScreen();
  });
});
