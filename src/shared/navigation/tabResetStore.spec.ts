import { useTabResetStore } from "./tabResetStore";

describe("tabResetStore", () => {
  beforeEach(() => {
    useTabResetStore.setState({ requestCounts: { today: 0, meds: 0 } });
  });

  it("counts the reset requests of each tab", () => {
    useTabResetStore.getState().requestTabReset("meds");
    useTabResetStore.getState().requestTabReset("meds");

    expect(useTabResetStore.getState().requestCounts).toEqual({ today: 0, meds: 2 });
  });
});
