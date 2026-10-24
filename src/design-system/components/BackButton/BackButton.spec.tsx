import { fireEvent, render, screen } from "@testing-library/react-native";

import { BackButton } from "./BackButton";

describe("BackButton", () => {
  it("is a labelled button calling onPress", async () => {
    const onPress = jest.fn();
    await render(<BackButton label="Calendrier" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Calendrier" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
