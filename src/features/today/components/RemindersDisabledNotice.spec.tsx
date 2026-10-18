import { fireEvent, render, screen } from "@testing-library/react-native";

import { RemindersDisabledNotice } from "./RemindersDisabledNotice";

describe("RemindersDisabledNotice", () => {
  const onEnable = jest.fn();

  it("explains that the reminders are disabled", async () => {
    await render(<RemindersDisabledNotice onEnable={onEnable} />);

    expect(screen.getByRole("header", { name: "Les rappels sont désactivés" })).toBeOnTheScreen();
    expect(
      screen.getByText("Activez les notifications pour recevoir vos rappels."),
    ).toBeOnTheScreen();
  });

  it("asks to enable the notifications", async () => {
    await render(<RemindersDisabledNotice onEnable={onEnable} />);

    await fireEvent.press(screen.getByRole("button", { name: "Activer les notifications" }));

    expect(onEnable).toHaveBeenCalledTimes(1);
  });
});
