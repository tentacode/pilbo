import Storage from "expo-sqlite/kv-store";

import { useSettingsStore } from "./settingsStore";

const initialState = useSettingsStore.getState();

describe("settingsStore", () => {
  beforeEach(() => {
    useSettingsStore.setState(initialState, true);
    Storage.clearSync();
  });

  it("has default values", () => {
    expect(useSettingsStore.getState()).toMatchObject({
      defaultReminderIntervalMinutes: 10,
      defaultReminderSound: "beep",
      lowStockDays: 7,
      lowStockSound: "beep",
      language: null,
      colorScheme: null,
    });
  });

  it("updates the default reminder interval", () => {
    useSettingsStore.getState().setDefaultReminderIntervalMinutes(15);

    expect(useSettingsStore.getState().defaultReminderIntervalMinutes).toBe(15);
  });

  it("updates the default reminder sound", () => {
    useSettingsStore.getState().setDefaultReminderSound("chime");

    expect(useSettingsStore.getState().defaultReminderSound).toBe("chime");
  });

  it("updates the low stock sound", () => {
    useSettingsStore.getState().setLowStockSound("vibration");

    expect(useSettingsStore.getState().lowStockSound).toBe("vibration");
  });

  it("updates the language", () => {
    useSettingsStore.getState().setLanguage("en");

    expect(useSettingsStore.getState().language).toBe("en");
  });

  it("updates the color scheme", () => {
    useSettingsStore.getState().setColorScheme("dark");

    expect(useSettingsStore.getState().colorScheme).toBe("dark");
  });

  it.each([
    [12, 12],
    [0, 1],
    [31, 30],
  ])("sets the low stock days %i to %i", (days, expected) => {
    useSettingsStore.getState().setLowStockDays(days);

    expect(useSettingsStore.getState().lowStockDays).toBe(expected);
  });

  it("writes only the values to the storage", () => {
    useSettingsStore.getState().setLanguage("fr");
    useSettingsStore.getState().setColorScheme("dark");

    expect(JSON.parse(Storage.getItemSync("settings") ?? "{}").state).toEqual({
      defaultReminderIntervalMinutes: 10,
      defaultReminderSound: "beep",
      lowStockDays: 7,
      lowStockSound: "beep",
      language: "fr",
      colorScheme: "dark",
    });
  });

  it("reads the values from the storage", () => {
    Storage.setItemSync(
      "settings",
      JSON.stringify({
        state: {
          defaultReminderIntervalMinutes: 30,
          defaultReminderSound: "nocturne",
          lowStockDays: 3,
          lowStockSound: "drop",
          language: "en",
          colorScheme: "light",
        },
        version: 0,
      }),
    );

    useSettingsStore.persist.rehydrate();

    expect(useSettingsStore.getState()).toMatchObject({
      defaultReminderIntervalMinutes: 30,
      defaultReminderSound: "nocturne",
      lowStockDays: 3,
      lowStockSound: "drop",
      language: "en",
      colorScheme: "light",
    });
  });

  it("keeps the default sounds when reading values saved without them", () => {
    Storage.setItemSync(
      "settings",
      JSON.stringify({
        state: {
          defaultReminderIntervalMinutes: 30,
          lowStockDays: 3,
          language: "en",
          colorScheme: "light",
        },
        version: 0,
      }),
    );

    useSettingsStore.persist.rehydrate();

    expect(useSettingsStore.getState()).toMatchObject({
      defaultReminderIntervalMinutes: 30,
      defaultReminderSound: "beep",
      lowStockSound: "beep",
    });
  });
});
