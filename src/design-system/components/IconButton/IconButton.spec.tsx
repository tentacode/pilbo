import { fireEvent, render, screen } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("is exposed as a labelled button", async () => {
    await render(<IconButton icon="plus" accessibilityLabel="Nouvelle prise" />);

    expect(screen.getByRole("button", { name: "Nouvelle prise" })).toBeOnTheScreen();
  });

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn();
    await render(<IconButton icon="plus" accessibilityLabel="Nouvelle prise" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Nouvelle prise" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("plays a light haptic feedback on press in", async () => {
    await render(<IconButton icon="plus" accessibilityLabel="Nouvelle prise" />);

    await fireEvent(screen.getByRole("button", { name: "Nouvelle prise" }), "pressIn");

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it("is disabled without calling onPress", async () => {
    const onPress = jest.fn();
    await render(
      <IconButton
        icon="chevronRight"
        accessibilityLabel="Jour suivant"
        onPress={onPress}
        isDisabled
      />,
    );

    const button = screen.getByRole("button", { name: "Jour suivant" });
    await fireEvent.press(button);

    expect(button).toBeDisabled();
    expect(onPress).not.toHaveBeenCalled();
  });
});
