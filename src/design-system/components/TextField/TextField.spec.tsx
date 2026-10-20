import { fireEvent, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";

import { TextField } from "./TextField";

describe("TextField", () => {
  it("labels the input and reports the typed text", async () => {
    const onChangeText = jest.fn();
    await render(<TextField label="Nom" value="" onChangeText={onChangeText} />);

    await fireEvent.changeText(screen.getByLabelText("Nom"), "Lithium");

    expect(onChangeText).toHaveBeenCalledWith("Lithium");
  });

  it("shows and announces the error", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
    await render(
      <TextField label="Nom" value="" onChangeText={jest.fn()} error="Indiquez le nom." />,
    );

    expect(screen.getByText("Indiquez le nom.", { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByLabelText("Nom")).toHaveProp("accessibilityHint", "Indiquez le nom.");
    expect(announce).toHaveBeenCalledWith("Indiquez le nom.");
  });
});
