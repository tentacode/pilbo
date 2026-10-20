import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Sheet } from "./Sheet";

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

describe("Sheet", () => {
  it("shows the title as a header, the content and the footer", async () => {
    await render(
      <Sheet
        title="Nouvelle prise"
        leftAction={{ label: "Annuler", onPress: jest.fn() }}
        footer={<Text>Pied</Text>}
      >
        <Text>Contenu</Text>
      </Sheet>,
      { wrapper },
    );

    expect(screen.getByRole("header", { name: "Nouvelle prise" })).toBeOnTheScreen();
    expect(screen.getByText("Contenu")).toBeOnTheScreen();
    expect(screen.getByText("Pied")).toBeOnTheScreen();
  });

  it("calls the navigation actions", async () => {
    const onCancel = jest.fn();
    const onDone = jest.fn();
    await render(
      <Sheet
        title="Apparence"
        leftAction={{ label: "Retour", icon: "chevronLeft", onPress: onCancel }}
        rightAction={{ label: "OK", onPress: onDone }}
      >
        <Text>Contenu</Text>
      </Sheet>,
      { wrapper },
    );

    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));
    await fireEvent.press(screen.getByRole("button", { name: "OK" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
