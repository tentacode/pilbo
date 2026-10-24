import { fireEvent, render, screen } from "@testing-library/react-native";

import { useState } from "react";

import { Stepper } from "./Stepper";

const LABELS = {
  value: "Quantité de Lithium",
  decrement: "Retirer un comprimé de Lithium",
  increment: "Ajouter un comprimé de Lithium",
  remove: "Retirer Lithium de la prise",
};

function renderStepper(value: number, onRemove?: () => void) {
  const onChange = jest.fn();
  const renderResult = render(
    <Stepper
      value={value}
      min={1}
      max={10}
      onChange={onChange}
      onRemove={onRemove}
      formatValue={(quantity) => `${quantity} ×`}
      labels={LABELS}
    />,
  );
  return { renderResult, onChange };
}

describe("Stepper", () => {
  it("shows the formatted value", async () => {
    await renderStepper(2).renderResult;

    expect(screen.getByText("2 ×")).toBeOnTheScreen();
  });

  it("increments and decrements the value", async () => {
    const { renderResult, onChange } = renderStepper(2);
    await renderResult;

    await fireEvent.press(screen.getByRole("button", { name: LABELS.increment }));
    await fireEvent.press(screen.getByRole("button", { name: LABELS.decrement }));

    expect(onChange).toHaveBeenNthCalledWith(1, 3);
    expect(onChange).toHaveBeenNthCalledWith(2, 1);
  });

  it("disables the decrement at the minimum without remove action", async () => {
    await renderStepper(1).renderResult;

    expect(screen.getByRole("button", { name: LABELS.decrement })).toBeDisabled();
  });

  it("disables the increment at the maximum", async () => {
    await renderStepper(10).renderResult;

    expect(screen.getByRole("button", { name: LABELS.increment })).toBeDisabled();
  });

  it("turns the decrement into a remove button at the minimum", async () => {
    const onRemove = jest.fn();
    const { renderResult, onChange } = renderStepper(1, onRemove);
    await renderResult;

    await fireEvent.press(screen.getByRole("button", { name: LABELS.remove }));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: LABELS.decrement })).not.toBeOnTheScreen();
  });

  it("is adjustable with the accessibility actions, within the bounds", async () => {
    const { renderResult, onChange } = renderStepper(10);
    await renderResult;
    const adjustable = screen.getByRole("adjustable", { name: LABELS.value });

    await fireEvent(adjustable, "accessibilityAction", {
      nativeEvent: { actionName: "increment" },
    });
    await fireEvent(adjustable, "accessibilityAction", {
      nativeEvent: { actionName: "decrement" },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(9);
  });
});

describe("editable Stepper", () => {
  function EditableStepper() {
    const [value, setValue] = useState(5);
    return (
      <Stepper value={value} min={0} max={99} onChange={setValue} labels={LABELS} isEditable />
    );
  }

  function input() {
    return screen.getByLabelText("Quantité de Lithium");
  }

  it("keeps only digits, within the bounds", async () => {
    await render(<EditableStepper />);

    await fireEvent(input(), "focus");
    await fireEvent.changeText(input(), "4a2");
    expect(input()).toHaveDisplayValue("42");

    await fireEvent.changeText(input(), "123");
    expect(input()).toHaveDisplayValue("12");
  });

  it("shows the minimum once an empty field loses the focus", async () => {
    await render(<EditableStepper />);

    await fireEvent(input(), "focus");
    await fireEvent.changeText(input(), "");
    expect(input()).toHaveDisplayValue("");

    await fireEvent(input(), "blur");
    expect(input()).toHaveDisplayValue("0");
  });

  it("follows the buttons while the field has the focus", async () => {
    await render(<EditableStepper />);

    await fireEvent(input(), "focus");
    await fireEvent.changeText(input(), "7");
    await fireEvent.press(screen.getByRole("button", { name: "Ajouter un comprimé de Lithium" }));

    expect(input()).toHaveDisplayValue("8");
  });
});
