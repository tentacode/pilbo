import { fireEvent, render, screen } from "@testing-library/react-native";

import { clearDatabase } from "@/shared/database/clearDatabase";
import { database } from "@/shared/database/database";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

import { ClearDatabaseButton } from "./ClearDatabaseButton";

jest.mock("@/shared/database/database", () => ({ database: {} }));
jest.mock("@/shared/database/clearDatabase", () => ({ clearDatabase: jest.fn() }));

describe("ClearDatabaseButton", () => {
  it("clears the database when pressed", async () => {
    await render(<ClearDatabaseButton />);

    await fireEvent.press(screen.getByRole("button", { name: "Vider la base" }));

    expect(clearDatabase).toHaveBeenCalledWith(database);
  });

  it("shows the onboarding again", async () => {
    useOnboardingStore.setState({ onboardingDone: true });
    await render(<ClearDatabaseButton />);

    await fireEvent.press(screen.getByRole("button", { name: "Vider la base" }));

    expect(useOnboardingStore.getState().onboardingDone).toBe(false);
  });
});
