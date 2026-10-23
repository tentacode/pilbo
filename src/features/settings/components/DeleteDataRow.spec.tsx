import { fireEvent, render, screen } from "@testing-library/react-native";

import { clearDatabase } from "@/shared/database/clearDatabase";
import { database } from "@/shared/database/database";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

import { DeleteDataRow } from "./DeleteDataRow";

jest.mock("@/shared/database/database", () => ({ database: {} }));
jest.mock("@/shared/database/clearDatabase", () => ({ clearDatabase: jest.fn() }));

describe("DeleteDataRow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOnboardingStore.setState({ onboardingDone: true });
  });

  it("asks for a confirmation before deleting", async () => {
    await render(<DeleteDataRow />);

    await fireEvent.press(screen.getByRole("button", { name: "Supprimer les données" }));

    expect(
      screen.getByRole("header", { name: "Supprimer toutes les données ?" }),
    ).toBeOnTheScreen();
    expect(clearDatabase).not.toHaveBeenCalled();
  });

  it("does nothing when cancelled", async () => {
    await render(<DeleteDataRow />);

    await fireEvent.press(screen.getByRole("button", { name: "Supprimer les données" }));
    await fireEvent.press(screen.getByRole("button", { name: "Annuler" }));

    expect(clearDatabase).not.toHaveBeenCalled();
    expect(useOnboardingStore.getState().onboardingDone).toBe(true);
    expect(
      screen.queryByRole("header", { name: "Supprimer toutes les données ?" }),
    ).not.toBeOnTheScreen();
  });

  it("clears the database and shows the onboarding again once confirmed", async () => {
    await render(<DeleteDataRow />);

    await fireEvent.press(screen.getByRole("button", { name: "Supprimer les données" }));
    await fireEvent.press(screen.getByRole("button", { name: "Supprimer" }));

    expect(clearDatabase).toHaveBeenCalledWith(database);
    expect(useOnboardingStore.getState().onboardingDone).toBe(false);
  });
});
