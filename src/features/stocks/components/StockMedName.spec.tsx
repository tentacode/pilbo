import { fireEvent, render, screen } from "@testing-library/react-native";

import { StockMedName } from "./StockMedName";

function layoutEvent(width: number) {
  return { nativeEvent: { layout: { x: 0, y: 0, width, height: 0 } } };
}

async function renderWithWidth(availableWidth: number) {
  await render(<StockMedName med={{ name: "Lamictal", strength: "50 mg" }} />);
  await fireEvent(
    screen.getByTestId("stock-med-name-measure", { includeHiddenElements: true }),
    "layout",
    layoutEvent(150),
  );
  await fireEvent(screen.getByTestId("stock-med-name"), "layout", layoutEvent(availableWidth));
}

describe("StockMedName", () => {
  it("shows the name and the strength on one line when they fit", async () => {
    await renderWithWidth(200);

    expect(screen.getByText("Lamictal 50 mg")).toBeOnTheScreen();
    expect(screen.queryByText("Lamictal")).not.toBeOnTheScreen();
  });

  it("shows the strength on its own line when they do not fit", async () => {
    await renderWithWidth(100);

    expect(screen.getByText("Lamictal")).toBeOnTheScreen();
    expect(screen.getByText("50 mg")).toBeOnTheScreen();
  });
});
