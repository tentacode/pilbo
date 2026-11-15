import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ActionSheet } from "./ActionSheet";

const CANCEL_LABEL = "Annuler";

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>;
}

function renderActionSheet(isVisible = true) {
  const onSkip = jest.fn();
  const onForget = jest.fn();
  const onRequestClose = jest.fn();
  const renderResult = render(
    <ActionSheet
      isVisible={isVisible}
      title="Vous ne l'avez pas pris ?"
      message="Prise de 08:00"
      actions={[
        { label: "Je l'ai ignoré", onPress: onSkip },
        { label: "Je l'ai oublié", onPress: onForget },
      ]}
      cancelLabel={CANCEL_LABEL}
      onRequestClose={onRequestClose}
    />,
    { wrapper },
  );
  return { renderResult, onSkip, onForget, onRequestClose };
}

describe("ActionSheet", () => {
  it("shows the title as a header and the message", async () => {
    await renderActionSheet().renderResult;

    expect(screen.getByRole("header", { name: "Vous ne l'avez pas pris ?" })).toBeOnTheScreen();
    expect(screen.getByText("Prise de 08:00")).toBeOnTheScreen();
  });

  it("calls the pressed action", async () => {
    const { renderResult, onSkip, onForget } = renderActionSheet();
    await renderResult;

    await fireEvent.press(screen.getByRole("button", { name: "Je l'ai oublié" }));

    expect(onForget).toHaveBeenCalledTimes(1);
    expect(onSkip).not.toHaveBeenCalled();
  });

  it("closes on cancel", async () => {
    const { renderResult, onRequestClose } = renderActionSheet();
    await renderResult;

    await fireEvent.press(screen.getByRole("button", { name: CANCEL_LABEL }));

    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when hidden", async () => {
    await renderActionSheet(false).renderResult;

    expect(screen.queryByRole("header")).not.toBeOnTheScreen();
  });
});
