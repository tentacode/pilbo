import Storage from "expo-sqlite/kv-store";

import { useSettingsStore } from "./settingsStore";

const initialState = useSettingsStore.getState();

describe("settingsStore", () => {
  beforeEach(() => {
    useSettingsStore.setState(initialState, true);
    Storage.clearSync();
  });

  it("has default values", () => {
    const { defaultReminderIntervalMinutes, lowStockDays, language, colorScheme } =
      useSettingsStore.getState();

    expect({ defaultReminderIntervalMinutes, lowStockDays, language, colorScheme }).toEqual({
      defaultReminderIntervalMinutes: 10,
      lowStockDays: 7,
      language: null,
      colorScheme: null,
    });
  });

  it("updates the default reminder interval", () => {
    useSettingsStore.getState().setDefaultReminderIntervalMinutes(15);

    expect(useSettingsStore.getState().defaultReminderIntervalMinutes).toBe(15);
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
      lowStockDays: 7,
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
      lowStockDays: 3,
      language: "en",
      colorScheme: "light",
    });
  });
});
