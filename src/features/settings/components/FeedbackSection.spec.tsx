import { fireEvent, render, screen } from "@testing-library/react-native";
import { Linking } from "react-native";

import { renderInEnglish } from "@/shared/i18n/testHelpers";

import { FeedbackSection } from "./FeedbackSection";

function openedMailSubject() {
  const url = jest.mocked(Linking.openURL).mock.calls[0][0];
  return decodeURIComponent(url.split("?subject=")[1].split("&body=")[0]);
}

describe("FeedbackSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Linking, "openURL").mockResolvedValue(true);
  });

  it("has a section title", async () => {
    await render(<FeedbackSection />);

    expect(screen.getByRole("header", { name: "Votre avis" })).toBeOnTheScreen();
  });

  it("opens an e-mail to report a bug", async () => {
    await render(<FeedbackSection />);

    await fireEvent.press(screen.getByRole("button", { name: "J'ai trouvé un bug" }));

    expect(Linking.openURL).toHaveBeenCalledWith(
      expect.stringMatching(/^mailto:pilbo@tentacode\.dev\?/),
    );
    expect(openedMailSubject()).toBe("Pilbo : j'ai trouvé un bug");
  });

  it("opens an e-mail to suggest an idea", async () => {
    await render(<FeedbackSection />);

    await fireEvent.press(screen.getByRole("button", { name: "J'ai une idée" }));

    expect(openedMailSubject()).toBe("Pilbo : j'ai une idée");
  });

  it("tells that the button opens an e-mail", async () => {
    await render(<FeedbackSection />);

    expect(screen.getByRole("button", { name: "J'ai une idée" })).toHaveProp(
      "accessibilityHint",
      "Ouvre un e-mail à l’équipe Pilbo",
    );
  });

  it("writes the e-mail in English", async () => {
    await renderInEnglish(<FeedbackSection />);

    await fireEvent.press(screen.getByRole("button", { name: "I found a bug" }));

    expect(openedMailSubject()).toBe("Pilbo: I found a bug");
  });
});
