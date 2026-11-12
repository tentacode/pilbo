import { reminderBadge } from "./reminderBadge";

describe("reminderBadge (Android)", () => {
  it("leaves the badge to the launcher", () => {
    expect(reminderBadge(2)).toBeUndefined();
  });
});
