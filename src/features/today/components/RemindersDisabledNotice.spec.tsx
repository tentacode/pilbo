import { fireEvent, render, screen } from "@testing-library/react-native";
import { Linking } from "react-native";

import { RemindersDisabledNotice } from "./RemindersDisabledNotice";

describe("RemindersDisabledNotice", () => {
  it("explains that the reminders are disabled", async () => {
    await render(<RemindersDisabledNotice />);

    expect(screen.getByRole("header", { name: "Les rappels sont désactivés" })).toBeOnTheScreen();
    expect(
      screen.getByText("Activez les notifications dans les Réglages pour recevoir vos rappels."),
    ).toBeOnTheScreen();
  });

  it("opens the settings", async () => {
    const openSettings = jest.spyOn(Linking, "openSettings").mockResolvedValue();
    await render(<RemindersDisabledNotice />);

    await fireEvent.press(screen.getByRole("button", { name: "Ouvrir les Réglages" }));

    expect(openSettings).toHaveBeenCalledTimes(1);
  });
});
