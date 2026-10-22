import { fireEvent, render, screen } from "@testing-library/react-native";

import type { Med } from "@/domain/med";

import { IntakeMedEditRow } from "./IntakeMedEditRow";

const med: Med = {
  id: "doliprane",
  name: "Doliprane",
  strength: "500 mg",
  detail: "Après le repas",
  design: { shape: "round", size: "medium", colors: ["#FFFFFF", "#FFFFFF"] },
  isAsNeeded: false,
};

function getStepperContainer() {
  const stepperContainer = screen.getByRole("button", {
    name: "Ajouter un comprimé de Doliprane 500 mg",
  }).parent?.parent;
  if (!stepperContainer) {
    throw new Error("Stepper container not found");
  }
  return stepperContainer;
}

function getRow() {
  const row = getStepperContainer().parent;
  if (!row) {
    throw new Error("Row not found");
  }
  return row;
}

function layoutEvent(width: number) {
  return { nativeEvent: { layout: { x: 0, y: 0, width, height: 0 } } };
}

describe("IntakeMedEditRow", () => {
  it.each([
    { layout: "side by side", rowWidth: 1000, flexDirection: "row" as const },
    { layout: "stacked", rowWidth: 300, flexDirection: "column" as const },
  ])("shows the med button and the stepper $layout", async ({ rowWidth, flexDirection }) => {
    await render(
      <IntakeMedEditRow
        med={med}
        quantity={2}
        hasTopBorder={false}
        onEditMed={jest.fn()}
        onQuantityChange={jest.fn()}
        onRemove={jest.fn()}
      />,
    );

    await fireEvent(getStepperContainer(), "layout", layoutEvent(132));
    await fireEvent(getRow(), "layout", layoutEvent(rowWidth));

    expect(getRow()).toHaveStyle({ flexDirection });
    expect(
      screen.getByRole("button", { name: "Doliprane 500 mg, Après le repas" }),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText("Quantité de Doliprane 500 mg")).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Retirer un comprimé de Doliprane 500 mg" }),
    ).toBeOnTheScreen();
  });
});
