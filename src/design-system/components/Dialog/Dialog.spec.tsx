import { fireEvent, render, screen } from "@testing-library/react-native";

import { Dialog } from "./Dialog";

const CONFIRM_LABEL = "Supprimer";
const CANCEL_LABEL = "Annuler";

function renderDialog(isVisible = true) {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();
  const renderResult = render(
    <Dialog
      isVisible={isVisible}
      icon="trash"
      title="Supprimer cette prise ?"
      message="L'historique est conservé."
      confirmAction={{ label: CONFIRM_LABEL, onPress: onConfirm }}
      cancelAction={{ label: CANCEL_LABEL, onPress: onCancel }}
      onRequestClose={onCancel}
    />,
  );
  return { renderResult, onConfirm, onCancel };
}

describe("Dialog", () => {
  it("shows the title as a header and the message", async () => {
    await renderDialog().renderResult;

    expect(screen.getByRole("header", { name: "Supprimer cette prise ?" })).toBeOnTheScreen();
    expect(screen.getByText("L'historique est conservé.")).toBeOnTheScreen();
  });

  it("calls the confirm action", async () => {
    const { renderResult, onConfirm } = renderDialog();
    await renderResult;

    await fireEvent.press(screen.getByRole("button", { name: CONFIRM_LABEL }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls the cancel action", async () => {
    const { renderResult, onCancel } = renderDialog();
    await renderResult;

    await fireEvent.press(screen.getByRole("button", { name: CANCEL_LABEL }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("shows a single action without cancel action", async () => {
    await render(
      <Dialog
        isVisible
        title="Votre médicament Lithium 250 mg existe déjà"
        confirmAction={{ label: "OK", onPress: jest.fn() }}
        onRequestClose={jest.fn()}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("renders nothing when hidden", async () => {
    await renderDialog(false).renderResult;

    expect(screen.queryByRole("header")).not.toBeOnTheScreen();
  });
});
