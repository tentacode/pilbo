import { fireEvent, render, screen } from "@testing-library/react-native";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

import { RestartOnboardingButton } from "./RestartOnboardingButton";

describe("RestartOnboardingButton", () => {
  it("shows the onboarding again when pressed", async () => {
    useOnboardingStore.setState({ onboardingDone: true });
    await render(<RestartOnboardingButton />);

    await fireEvent.press(screen.getByRole("button", { name: "Refaire l'onboarding" }));

    expect(useOnboardingStore.getState().onboardingDone).toBe(false);
  });
});
