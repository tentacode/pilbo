import { fireEvent, render, screen } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { Button, type ButtonVariant } from "./Button";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "text"];

describe("Button", () => {
  it("is exposed as a labelled button", async () => {
    await render(<Button label="Contactez-nous" onPress={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Contactez-nous" })).toBeOnTheScreen();
  });

  it.each(VARIANTS)("renders the label of the %s variant", async (variant) => {
    await render(<Button label="Prendre" variant={variant} icon="plus" onPress={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Prendre" })).toBeOnTheScreen();
    expect(screen.getByText("Prendre")).toBeOnTheScreen();
  });

  it("renders the large size", async () => {
    await render(<Button label="Prendre" variant="secondary" size="large" onPress={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Prendre" })).toBeOnTheScreen();
  });

  it("uses the custom accessibility label instead of the label", async () => {
    await render(
      <Button label="Prendre" accessibilityLabel="Prendre la prise de 12:20" onPress={jest.fn()} />,
    );

    expect(screen.getByRole("button", { name: "Prendre la prise de 12:20" })).toBeOnTheScreen();
  });

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn();
    await render(<Button label="Contactez-nous" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Contactez-nous" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is disabled and ignores presses when isDisabled is set", async () => {
    const onPress = jest.fn();
    await render(<Button label="Prendre" isDisabled onPress={onPress} />);

    const button = screen.getByRole("button", { name: "Prendre" });
    await fireEvent.press(button);

    expect(button).toBeDisabled();
    expect(onPress).not.toHaveBeenCalled();
  });

  it("plays a light haptic feedback on press in", async () => {
    await render(<Button label="Contactez-nous" onPress={jest.fn()} />);

    await fireEvent(screen.getByRole("button", { name: "Contactez-nous" }), "pressIn");

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });
});
