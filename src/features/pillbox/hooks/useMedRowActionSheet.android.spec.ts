import { renderHook } from "@testing-library/react-native";
import { Alert, type AlertButton } from "react-native";

import { useMedRowActionSheet } from "./useMedRowActionSheet";

async function showActionSheet() {
  const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  const actions = { medLabel: "Lamictal 50 mg", onEditMed: jest.fn(), onRemove: jest.fn() };
  const { result } = await renderHook(() => useMedRowActionSheet());
  result.current(actions);
  const [title, , buttons] = alert.mock.lastCall ?? [];
  return { actions, title, buttons: buttons as AlertButton[] };
}

function pressButton(buttons: AlertButton[], text: string) {
  buttons.find((button) => button.text === text)?.onPress?.();
}

describe("useMedRowActionSheet (Android)", () => {
  it("shows the med as title, with cancel first so that it ends up last once stacked", async () => {
    const { title, buttons } = await showActionSheet();

    expect(title).toBe("Lamictal 50 mg");
    expect(buttons.map((button) => button.text)).toEqual([
      "Annuler",
      "Retirer de la prise",
      "Modifier le médicament",
    ]);
    expect(buttons[0].style).toBe("cancel");
  });

  it("edits the med", async () => {
    const { actions, buttons } = await showActionSheet();

    pressButton(buttons, "Modifier le médicament");

    expect(actions.onEditMed).toHaveBeenCalledTimes(1);
    expect(actions.onRemove).not.toHaveBeenCalled();
  });

  it("removes the med from the intake", async () => {
    const { actions, buttons } = await showActionSheet();

    pressButton(buttons, "Retirer de la prise");

    expect(actions.onRemove).toHaveBeenCalledTimes(1);
    expect(actions.onEditMed).not.toHaveBeenCalled();
  });

  it("does nothing on cancel", async () => {
    const { actions, buttons } = await showActionSheet();

    pressButton(buttons, "Annuler");

    expect(actions.onEditMed).not.toHaveBeenCalled();
    expect(actions.onRemove).not.toHaveBeenCalled();
  });
});
