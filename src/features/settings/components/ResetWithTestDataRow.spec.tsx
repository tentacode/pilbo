import { fireEvent, render, screen } from "@testing-library/react-native";

import { database } from "@/shared/database/database";
import { resetDatabase } from "@/shared/database/resetDatabase";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

import { ResetWithTestDataRow } from "./ResetWithTestDataRow";

jest.mock("@/shared/database/database", () => ({ database: {} }));
jest.mock("@/shared/database/resetDatabase", () => ({ resetDatabase: jest.fn() }));

const ROW_NAME = "Réinitialiser avec des données de test";

describe("ResetWithTestDataRow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOnboardingStore.setState({ onboardingDone: false });
  });

  it("asks for a confirmation before resetting", async () => {
    await render(<ResetWithTestDataRow />);

    await fireEvent.press(screen.getByRole("button", { name: ROW_NAME }));

    expect(screen.getByRole("header", { name: "Remplacer vos données ?" })).toBeOnTheScreen();
    expect(resetDatabase).not.toHaveBeenCalled();
  });

  it("does nothing when cancelled", async () => {
    await render(<ResetWithTestDataRow />);

    await fireEvent.press(screen.getByRole("button", { name: ROW_NAME }));
    await fireEvent.press(screen.getByRole("button", { name: "Annuler" }));

    expect(resetDatabase).not.toHaveBeenCalled();
    expect(useOnboardingStore.getState().onboardingDone).toBe(false);
  });

  it("resets the database and marks the onboarding as done once confirmed", async () => {
    await render(<ResetWithTestDataRow />);

    await fireEvent.press(screen.getByRole("button", { name: ROW_NAME }));
    await fireEvent.press(screen.getByRole("button", { name: "Réinitialiser" }));

    expect(resetDatabase).toHaveBeenCalledWith(database, { withLogs: true });
    expect(useOnboardingStore.getState().onboardingDone).toBe(true);
  });
});
