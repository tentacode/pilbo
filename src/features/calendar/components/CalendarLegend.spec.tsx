import { fireEvent, render, screen } from "@testing-library/react-native";

import { CalendarLegend } from "./CalendarLegend";

function layout(width: number) {
  return { nativeEvent: { layout: { x: 0, y: 0, width, height: 0 } } };
}

describe("CalendarLegend", () => {
  it("lists every status", async () => {
    await render(<CalendarLegend />);

    for (const label of ["Pris", "En retard", "Non pris", "Ignoré", "Aujourd'hui"]) {
      expect(screen.getByLabelText(label)).toBeOnTheScreen();
    }
  });

  it("uses two columns when the longest label fits, one otherwise", async () => {
    await render(<CalendarLegend />);
    const legend = screen.getByTestId("calendar-legend");
    const measure = screen.getByTestId("calendar-legend-measure", { includeHiddenElements: true });

    await fireEvent(measure, "layout", layout(100));
    await fireEvent(legend, "layout", layout(343));

    expect(screen.getByTestId("calendar-legend-taken")).toHaveStyle({ width: "50%" });

    await fireEvent(measure, "layout", layout(200));

    expect(screen.getByTestId("calendar-legend-taken")).toHaveStyle({ width: "100%" });
  });
});
