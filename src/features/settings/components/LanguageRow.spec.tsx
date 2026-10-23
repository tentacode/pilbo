import { fireEvent, render, screen } from "@testing-library/react-native";
import { getLocales } from "expo-localization";

import { useSettingsStore } from "../store/settingsStore";
import { LanguageRow } from "./LanguageRow";

jest.mock("expo-localization", () => ({ getLocales: jest.fn() }));

function mockSystemLanguage(languageCode: string) {
  jest.mocked(getLocales).mockReturnValue([{ languageCode } as ReturnType<typeof getLocales>[0]]);
}

describe("LanguageRow", () => {
  beforeEach(() => {
    useSettingsStore.setState({ language: null });
    mockSystemLanguage("fr");
  });

  it("follows the system language by default", async () => {
    mockSystemLanguage("en");

    await render(<LanguageRow />);

    expect(screen.getByRole("radio", { name: "English" })).toBeSelected();
  });

  it("changes the language", async () => {
    await render(<LanguageRow />);

    await fireEvent.press(screen.getByRole("radio", { name: "English" }));

    expect(useSettingsStore.getState().language).toBe("en");
    expect(screen.getByRole("radio", { name: "English" })).toBeSelected();
  });
});
