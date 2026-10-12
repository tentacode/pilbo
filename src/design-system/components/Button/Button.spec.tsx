import { fireEvent, render, screen } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { Button } from "./Button";

describe("Button", () => {
  it("is exposed as a labelled button", async () => {
    await render(<Button label="Contactez-nous" onPress={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Contactez-nous" })).toBeOnTheScreen();
  });

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn();
    await render(<Button label="Contactez-nous" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Contactez-nous" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("plays a light haptic feedback on press in", async () => {
    await render(<Button label="Contactez-nous" onPress={jest.fn()} />);

    await fireEvent(screen.getByRole("button", { name: "Contactez-nous" }), "pressIn");

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });
});
