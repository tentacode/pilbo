import { fireEvent, render, screen } from "@testing-library/react-native";

import { IntakeDaysField } from "./IntakeDaysField";

const DAY_NAMES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

async function renderField() {
  const onDayPress = jest.fn();
  await render(
    <IntakeDaysField
      dayMode="someDays"
      selectedDays={["monday"]}
      onDayModeChange={jest.fn()}
      onDayPress={onDayPress}
    />,
  );
  return onDayPress;
}

function getDaysContainer() {
  const daysContainer = screen.getByRole("button", { name: "Lundi" }).parent?.parent;
  if (!daysContainer) {
    throw new Error("Days container not found");
  }
  return daysContainer;
}

async function layoutDays(width: number) {
  await fireEvent(getDaysContainer(), "layout", {
    nativeEvent: { layout: { x: 0, y: 0, width, height: 0 } },
  });
}

describe("IntakeDaysField", () => {
  it.each([
    { layout: "one row", width: 700, rowCount: 1 },
    { layout: "two rows", width: 300, rowCount: 2 },
  ])("keeps the 7 days selectable on $layout", async ({ width, rowCount }) => {
    const onDayPress = await renderField();

    await layoutDays(width);

    expect(getDaysContainer().children).toHaveLength(rowCount);
    expect(screen.getAllByRole("button").map((button) => button.props.accessibilityLabel)).toEqual(
      DAY_NAMES,
    );
    expect(screen.getByRole("button", { name: "Lundi" })).toBeSelected();
    await fireEvent.press(screen.getByRole("button", { name: "Dimanche" }));
    expect(onDayPress).toHaveBeenCalledWith("sunday");
  });
});
