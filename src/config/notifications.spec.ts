import { lowStockChannelId, reminderChannelId } from "./notifications";

describe("reminderChannelId", () => {
  it("keeps the original channel for the default sound", () => {
    expect(reminderChannelId("beep")).toBe("intake-reminders");
  });

  it("adds the sound to the other channels", () => {
    expect(reminderChannelId("chime")).toBe("intake-reminders-chime");
    expect(reminderChannelId("vibration")).toBe("intake-reminders-vibration");
  });
});

describe("lowStockChannelId", () => {
  it("keeps the original channel for the default sound", () => {
    expect(lowStockChannelId("beep")).toBe("low-stock");
  });

  it("adds the sound to the other channels", () => {
    expect(lowStockChannelId("gentle_alert_resolved")).toBe("low-stock-gentle_alert_resolved");
  });
});
