import { fireEvent, render, screen } from "@testing-library/react-native";

import { database } from "@/shared/database/database";
import { resetDatabase } from "@/shared/database/resetDatabase";

import { ResetDatabaseButton } from "./ResetDatabaseButton";

jest.mock("@/shared/database/database", () => ({ database: {} }));
jest.mock("@/shared/database/resetDatabase", () => ({ resetDatabase: jest.fn() }));

describe("ResetDatabaseButton", () => {
  it("resets the database when pressed", async () => {
    await render(<ResetDatabaseButton />);

    await fireEvent.press(screen.getByRole("button", { name: "Réinitialiser la base" }));

    expect(resetDatabase).toHaveBeenCalledWith(database);
  });
});
