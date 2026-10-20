import { fireEvent, render, screen } from "@testing-library/react-native";

import { ColorSwatch } from "./ColorSwatch";

describe("ColorSwatch", () => {
  it("is a labelled radio with its selected state", async () => {
    await render(<ColorSwatch label="Lilas" colors={["#D6C9F5"]} isSelected onPress={jest.fn()} />);

    expect(screen.getByRole("radio", { name: "Lilas" })).toBeSelected();
  });

  it("renders a color wheel with several colors and reports the press", async () => {
    const onPress = jest.fn();
    await render(
      <ColorSwatch
        label="Autre couleur"
        colors={["#FFC8D9", "#BBE8C3", "#B1E2FF"]}
        isSelected={false}
        onPress={onPress}
      />,
    );

    await fireEvent.press(screen.getByRole("radio", { name: "Autre couleur" }));

    expect(screen.getByRole("radio", { name: "Autre couleur" })).not.toBeSelected();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
