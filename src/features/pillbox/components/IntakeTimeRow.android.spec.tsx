import { fireEvent, render, screen } from "@testing-library/react-native";

import { IntakeTimeRow } from "./IntakeTimeRow";

jest.mock("@expo/ui/jetpack-compose", () => {
  const { createElement } = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    Host: ({ children }: { children: unknown }) => children,
    TimePickerDialog: (props: object) =>
      createElement(View, { testID: "time-picker-dialog", ...props }),
  };
});

const time = { hour: 8, minute: 30 };

describe("IntakeTimeRow (Android)", () => {
  it("shows the time on a button, without the dialog", async () => {
    await render(<IntakeTimeRow time={time} onChange={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Heure : 08:30" })).toHaveTextContent("08:30");
    expect(screen.queryByTestId("time-picker-dialog")).not.toBeOnTheScreen();
  });

  it("opens the dialog on the current time", async () => {
    await render(<IntakeTimeRow time={time} onChange={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Heure : 08:30" }));

    const dialog = screen.getByTestId("time-picker-dialog");
    const initialDate = new Date(dialog.props.initialDate);
    expect([initialDate.getHours(), initialDate.getMinutes()]).toEqual([8, 30]);
    expect(dialog.props.is24Hour).toBe(true);
  });

  it("sends the selected time and closes the dialog", async () => {
    const onChange = jest.fn();
    await render(<IntakeTimeRow time={time} onChange={onChange} />);

    await fireEvent.press(screen.getByRole("button", { name: "Heure : 08:30" }));
    await fireEvent(
      screen.getByTestId("time-picker-dialog"),
      "dateSelected",
      new Date(2026, 10, 8, 21, 15),
    );

    expect(onChange).toHaveBeenCalledWith({ hour: 21, minute: 15 });
    expect(screen.queryByTestId("time-picker-dialog")).not.toBeOnTheScreen();
  });

  it("closes the dialog without change when dismissed", async () => {
    const onChange = jest.fn();
    await render(<IntakeTimeRow time={time} onChange={onChange} />);

    await fireEvent.press(screen.getByRole("button", { name: "Heure : 08:30" }));
    await fireEvent(screen.getByTestId("time-picker-dialog"), "dismissRequest");

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId("time-picker-dialog")).not.toBeOnTheScreen();
  });

  it("uses the custom label for screen readers", async () => {
    await render(
      <IntakeTimeRow time={time} onChange={jest.fn()} accessibilityLabel="Heure du rappel" />,
    );

    expect(screen.getByRole("button", { name: "Heure du rappel" })).toBeOnTheScreen();
  });
});
