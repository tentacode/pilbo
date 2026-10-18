import { medTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";

import { useOnboardingStore } from "../store/onboardingStore";
import { setupFirstLaunch } from "./setupFirstLaunch";

describe("setupFirstLaunch", () => {
  beforeEach(() => {
    useOnboardingStore.setState({ onboardingDone: false });
  });

  it("seeds the database and skips the onboarding on the first launch in debug mode", () => {
    const database = createTestDatabase({ seed: false });

    setupFirstLaunch(database, { isDebugMode: true, isFirstLaunch: true });

    expect(countRows(database, medTable)).toBe(6);
    expect(useOnboardingStore.getState().onboardingDone).toBe(true);
  });

  it.each([
    { isDebugMode: true, isFirstLaunch: false },
    { isDebugMode: false, isFirstLaunch: true },
    { isDebugMode: false, isFirstLaunch: false },
  ])("does nothing when %o", (options) => {
    const database = createTestDatabase({ seed: false });

    setupFirstLaunch(database, options);

    expect(countRows(database, medTable)).toBe(0);
    expect(useOnboardingStore.getState().onboardingDone).toBe(false);
  });
});
