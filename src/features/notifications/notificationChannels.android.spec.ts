import * as Notifications from "expo-notifications";

import { i18n } from "@/shared/i18n/i18n";

import { setUpNotificationChannels } from "./notificationChannels";

jest.mock("expo-notifications", () => ({
  setNotificationChannelAsync: jest.fn(() => Promise.resolve(null)),
  getNotificationChannelsAsync: jest.fn(() => Promise.resolve([])),
  deleteNotificationChannelAsync: jest.fn(() => Promise.resolve()),
  AndroidImportance: { DEFAULT: 3, HIGH: 4 },
}));

const DEFAULT_SOUNDS = { reminders: ["beep" as const], lowStock: ["beep" as const] };

function existingChannels(...ids: string[]) {
  jest
    .mocked(Notifications.getNotificationChannelsAsync)
    .mockResolvedValue(ids.map((id) => ({ id }) as Notifications.NotificationChannel));
}

describe("setUpNotificationChannels (Android)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates the default reminders and low stock channels, with sound and vibration", async () => {
    await setUpNotificationChannels(DEFAULT_SOUNDS);

    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledTimes(2);
    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith("intake-reminders", {
      name: "Rappels de prise – Beep Boop Beep Boop",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "beep.wav",
      enableVibrate: true,
    });
    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith("low-stock", {
      name: "Stock bas – Beep Boop Beep Boop",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: "beep.wav",
      enableVibrate: true,
    });
  });

  it("creates one channel per used sound, once", async () => {
    await setUpNotificationChannels({
      reminders: ["beep", "chime", "chime"],
      lowStock: ["nocturne"],
    });

    expect(
      jest.mocked(Notifications.setNotificationChannelAsync).mock.calls.map(([id]) => id),
    ).toEqual(["intake-reminders", "intake-reminders-chime", "low-stock-nocturne"]);
    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      "intake-reminders-chime",
      expect.objectContaining({ name: "Rappels de prise – Sonnette", sound: "chime.wav" }),
    );
  });

  it("creates a vibration channel without sound", async () => {
    await setUpNotificationChannels({ reminders: ["vibration"], lowStock: ["beep"] });

    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      "intake-reminders-vibration",
      expect.objectContaining({ sound: null, enableVibrate: true }),
    );
  });

  it("deletes the unused Pilbo channels only", async () => {
    existingChannels(
      "intake-reminders",
      "intake-reminders-chime",
      "low-stock",
      "low-stock-drop",
      "miscellaneous",
    );

    await setUpNotificationChannels({ reminders: ["beep"], lowStock: ["nocturne"] });

    expect(
      jest.mocked(Notifications.deleteNotificationChannelAsync).mock.calls.map(([id]) => id),
    ).toEqual(["intake-reminders-chime", "low-stock", "low-stock-drop"]);
  });

  it("names the channels in the app language", async () => {
    await i18n.changeLanguage("en");

    await setUpNotificationChannels({ reminders: ["drop"], lowStock: ["beep"] });

    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      "intake-reminders-drop",
      expect.objectContaining({ name: "Intake reminders – Slippery" }),
    );
  });
});
