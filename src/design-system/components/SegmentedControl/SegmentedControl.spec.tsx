import { fireEvent, render, screen } from "@testing-library/react-native";

import { SegmentedControl } from "./SegmentedControl";

const OPTIONS = [
  { value: 5, label: "5 min", accessibilityLabel: "5 minutes" },
  { value: 10, label: "10 min", accessibilityLabel: "10 minutes" },
];

describe("SegmentedControl", () => {
  it("exposes the options as radios with the selected state", async () => {
    await render(
      <SegmentedControl
        options={OPTIONS}
        selectedValue={10}
        onChange={jest.fn()}
        accessibilityLabel="Intervalle des rappels"
      />,
    );

    expect(screen.getByLabelText("Intervalle des rappels")).toHaveProp(
      "accessibilityRole",
      "radiogroup",
    );
    expect(screen.getByRole("radio", { name: "10 minutes" })).toBeSelected();
    expect(screen.getByRole("radio", { name: "5 minutes" })).not.toBeSelected();
  });

  it("calls onChange with the pressed value", async () => {
    const onChange = jest.fn();
    await render(
      <SegmentedControl
        options={OPTIONS}
        selectedValue={10}
        onChange={onChange}
        accessibilityLabel="Intervalle des rappels"
      />,
    );

    await fireEvent.press(screen.getByRole("radio", { name: "5 minutes" }));

    expect(onChange).toHaveBeenCalledWith(5);
  });
});
