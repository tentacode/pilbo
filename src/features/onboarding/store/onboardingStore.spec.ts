import Storage from "expo-sqlite/kv-store";

import { isFirstLaunch, useOnboardingStore } from "./onboardingStore";

describe("onboardingStore", () => {
  beforeEach(() => {
    Storage.clearSync();
    useOnboardingStore.setState({ onboardingDone: false });
    Storage.clearSync();
  });

  it("is not done by default", () => {
    expect(useOnboardingStore.getState().onboardingDone).toBe(false);
  });

  it("updates onboardingDone", () => {
    useOnboardingStore.getState().setOnboardingDone(true);

    expect(useOnboardingStore.getState().onboardingDone).toBe(true);
  });

  it("writes onboardingDone to the storage", () => {
    useOnboardingStore.getState().setOnboardingDone(true);

    expect(JSON.parse(Storage.getItemSync("onboarding") ?? "{}").state).toEqual({
      onboardingDone: true,
    });
  });

  it("reads onboardingDone from the storage", () => {
    Storage.setItemSync(
      "onboarding",
      JSON.stringify({ state: { onboardingDone: true }, version: 0 }),
    );

    useOnboardingStore.persist.rehydrate();

    expect(useOnboardingStore.getState().onboardingDone).toBe(true);
  });

  it("detects the first launch until the store is written", () => {
    expect(isFirstLaunch()).toBe(true);

    useOnboardingStore.getState().setOnboardingDone(false);

    expect(isFirstLaunch()).toBe(false);
  });
});
