import { fireEvent, render, screen } from "@testing-library/react-native";

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
});
