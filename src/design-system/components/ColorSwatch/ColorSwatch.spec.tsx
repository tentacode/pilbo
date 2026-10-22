import { fireEvent, render, screen } from "@testing-library/react-native";

import { ColorSwatch } from "./ColorSwatch";

describe("ColorSwatch", () => {
  it("is a labelled radio with its selected state", async () => {
    await render(<ColorSwatch label="Lilas" color="#D6C9F5" isSelected onPress={jest.fn()} />);

    expect(screen.getByRole("radio", { name: "Lilas" })).toBeSelected();
  });

  it("reports the press", async () => {
    const onPress = jest.fn();
    await render(
      <ColorSwatch label="Menthe" color="#B3E8E0" isSelected={false} onPress={onPress} />,
    );

    await fireEvent.press(screen.getByRole("radio", { name: "Menthe" }));

    expect(screen.getByRole("radio", { name: "Menthe" })).not.toBeSelected();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
