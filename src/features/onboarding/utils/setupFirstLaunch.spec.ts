import { medTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";

import { useOnboardingStore } from "../store/onboardingStore";
import { setupFirstLaunch } from "./setupFirstLaunch";

describe("setupFirstLaunch", () => {
  beforeEach(() => {
    useOnboardingStore.setState({ onboardingDone: false });
  });

  it("seeds the database and skips the onboarding on the first launch of the dev variant", () => {
    const database = createTestDatabase({ seed: false });

    setupFirstLaunch(database, { isDevVariant: true, isFirstLaunch: true });

    expect(countRows(database, medTable)).toBe(6);
    expect(useOnboardingStore.getState().onboardingDone).toBe(true);
  });

  it.each([
    { isDevVariant: true, isFirstLaunch: false },
    { isDevVariant: false, isFirstLaunch: true },
    { isDevVariant: false, isFirstLaunch: false },
  ])("does nothing when %o", (options) => {
    const database = createTestDatabase({ seed: false });

    setupFirstLaunch(database, options);

    expect(countRows(database, medTable)).toBe(0);
    expect(useOnboardingStore.getState().onboardingDone).toBe(false);
  });
});
