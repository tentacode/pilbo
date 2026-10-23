import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

import { AboutSection } from "./AboutSection";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));
jest.mock("expo-application", () => ({
  nativeApplicationVersion: "1.0.0",
  nativeBuildVersion: "12",
}));

describe("AboutSection", () => {
  const onVersionPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("has a section title", async () => {
    await render(<AboutSection onVersionPress={onVersionPress} />);

    expect(screen.getByRole("header", { name: "À propos" })).toBeOnTheScreen();
  });

  it("shows the onboarding again", async () => {
    useOnboardingStore.setState({ onboardingDone: true });
    await render(<AboutSection onVersionPress={onVersionPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Revoir la présentation" }));

    expect(useOnboardingStore.getState().onboardingDone).toBe(false);
  });

  it("opens the not medical screen", async () => {
    await render(<AboutSection onVersionPress={onVersionPress} />);

    await fireEvent.press(
      screen.getByRole("button", { name: "Pilbo n'est pas une application médicale" }),
    );

    expect(router.push).toHaveBeenCalledWith("/not-medical");
  });

  it("shows the version, not as a button", async () => {
    await render(<AboutSection onVersionPress={onVersionPress} />);

    expect(screen.getByLabelText("Version 1.0.0 (12)")).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Version/ })).not.toBeOnTheScreen();
  });

  it("reports the presses on the version", async () => {
    await render(<AboutSection onVersionPress={onVersionPress} />);

    await fireEvent.press(screen.getByLabelText("Version 1.0.0 (12)"));

    expect(onVersionPress).toHaveBeenCalledTimes(1);
  });
});
