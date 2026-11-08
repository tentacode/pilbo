import * as Notifications from "expo-notifications";

import { i18n } from "@/shared/i18n/i18n";

import { setUpNotificationChannels } from "./notificationChannels";

jest.mock("expo-notifications", () => ({
  setNotificationChannelAsync: jest.fn(() => Promise.resolve(null)),
  AndroidImportance: { DEFAULT: 3, HIGH: 4 },
}));

describe("setUpNotificationChannels (Android)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates the reminders and low stock channels, with sound and vibration", async () => {
    await setUpNotificationChannels();

    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledTimes(2);
    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith("intake-reminders", {
      name: "Rappels de prise",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "beep.wav",
      enableVibrate: true,
    });
    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith("low-stock", {
      name: "Stock bas",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: "beep.wav",
      enableVibrate: true,
    });
  });

  it("names the channels in the app language", async () => {
    await i18n.changeLanguage("en");

    await setUpNotificationChannels();

    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      "intake-reminders",
      expect.objectContaining({ name: "Intake reminders" }),
    );
  });
});
