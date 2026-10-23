import { fireEvent, render, screen } from "@testing-library/react-native";
import { Component, type ReactNode } from "react";
import { Text } from "react-native";

import { SimulateErrorRow } from "./SimulateErrorRow";

class TestErrorBoundary extends Component<{ children: ReactNode }, { error?: Error }> {
  state: { error?: Error } = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    return this.state.error ? <Text>{this.state.error.message}</Text> : this.props.children;
  }
}

describe("SimulateErrorRow", () => {
  it("throws a render error when pressed, without confirmation", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    await render(
      <TestErrorBoundary>
        <SimulateErrorRow />
      </TestErrorBoundary>,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Simuler une erreur" }));

    expect(screen.getByText("Simulated error from the settings screen")).toBeOnTheScreen();
  });
});
