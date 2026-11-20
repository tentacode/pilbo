import { fireEvent, render, screen } from "@testing-library/react-native";

import { IntakeDaysField } from "./IntakeDaysField";

describe("IntakeDaysField", () => {
  it("opens the recurrence screen when custom is chosen", async () => {
    const onDayModeChange = jest.fn();
    const onOpenRecurrence = jest.fn();
    await render(
      <IntakeDaysField
        dayMode="everyDay"
        recurrence="Tous les jours"
        nextIntake={null}
        onDayModeChange={onDayModeChange}
        onOpenRecurrence={onOpenRecurrence}
      />,
    );

    expect(screen.queryByRole("button")).toBeNull();
    await fireEvent.press(screen.getByRole("radio", { name: "Personnalisé" }));

    expect(onDayModeChange).toHaveBeenCalledWith("custom");
    expect(onOpenRecurrence).toHaveBeenCalled();
  });

  it("shows the custom recurrence and the next intake in a row", async () => {
    const onOpenRecurrence = jest.fn();
    await render(
      <IntakeDaysField
        dayMode="custom"
        recurrence="Le 2 de chaque mois"
        nextIntake="Prochaine : demain"
        onDayModeChange={jest.fn()}
        onOpenRecurrence={onOpenRecurrence}
      />,
    );

    expect(screen.getByRole("radio", { name: "Personnalisé" })).toBeSelected();
    await fireEvent.press(
      screen.getByRole("button", { name: "Le 2 de chaque mois. Prochaine : demain" }),
    );
    expect(onOpenRecurrence).toHaveBeenCalled();
  });
});
