import { fireEvent, render, screen } from "@testing-library/react-native";

import { ColorSlider } from "./ColorSlider";

function renderSlider(value: number) {
  const onChange = jest.fn();
  const renderResult = render(
    <ColorSlider
      value={value}
      maximum={100}
      trackColors={["#FFFFFF", "#F4B183", "#2E1A0E"]}
      thumbColor="#F4B183"
      accessibilityLabel="Intensité"
      formatAccessibilityValue={(current) => `${current} %`}
      onChange={onChange}
    />,
  );
  return { renderResult, onChange };
}

describe("ColorSlider", () => {
  it("is adjustable with its value", async () => {
    await renderSlider(50).renderResult;

    expect(screen.getByRole("adjustable", { name: "Intensité" })).toHaveProp("accessibilityValue", {
      min: 0,
      max: 100,
      now: 50,
      text: "50 %",
    });
  });

  it("moves by 5 % with the accessibility actions", async () => {
    const { renderResult, onChange } = renderSlider(50);
    await renderResult;
    const slider = screen.getByRole("adjustable", { name: "Intensité" });

    await fireEvent(slider, "accessibilityAction", { nativeEvent: { actionName: "increment" } });
    await fireEvent(slider, "accessibilityAction", { nativeEvent: { actionName: "decrement" } });

    expect(onChange).toHaveBeenNthCalledWith(1, 55);
    expect(onChange).toHaveBeenNthCalledWith(2, 45);
  });

  it("stays within the bounds", async () => {
    const { renderResult, onChange } = renderSlider(98);
    await renderResult;

    await fireEvent(screen.getByRole("adjustable", { name: "Intensité" }), "accessibilityAction", {
      nativeEvent: { actionName: "increment" },
    });

    expect(onChange).toHaveBeenCalledWith(100);
  });
});
