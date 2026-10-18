import { fireEvent, render, screen } from "@testing-library/react-native";

import { database } from "@/shared/database/database";
import { resetDatabase } from "@/shared/database/resetDatabase";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

import { ResetDatabaseButton } from "./ResetDatabaseButton";

jest.mock("@/shared/database/database", () => ({ database: {} }));
jest.mock("@/shared/database/resetDatabase", () => ({ resetDatabase: jest.fn() }));

describe("ResetDatabaseButton", () => {
  it("resets the database when pressed", async () => {
    await render(<ResetDatabaseButton />);

    await fireEvent.press(screen.getByRole("button", { name: "Réinitialiser la base" }));

    expect(resetDatabase).toHaveBeenCalledWith(database, { withLogs: true });
  });

  it("marks the onboarding as done", async () => {
    useOnboardingStore.setState({ onboardingDone: false });
    await render(<ResetDatabaseButton />);

    await fireEvent.press(screen.getByRole("button", { name: "Réinitialiser la base" }));

    expect(useOnboardingStore.getState().onboardingDone).toBe(true);
  });
});
