import Storage from "expo-sqlite/kv-store";

import { useLowStockNoticeStore } from "./lowStockNoticeStore";

describe("lowStockNoticeStore", () => {
  beforeEach(() => {
    useLowStockNoticeStore.setState({ dismissedMedIds: [] });
    Storage.clearSync();
  });

  it("has no dismissed med by default", () => {
    expect(useLowStockNoticeStore.getState().dismissedMedIds).toEqual([]);
  });

  it("writes the dismissed meds to the storage", () => {
    useLowStockNoticeStore.getState().setDismissedMedIds(["lithium"]);

    expect(JSON.parse(Storage.getItemSync("lowStockNotice") ?? "{}").state).toEqual({
      dismissedMedIds: ["lithium"],
    });
  });

  it("reads the dismissed meds from the storage", () => {
    Storage.setItemSync(
      "lowStockNotice",
      JSON.stringify({ state: { dismissedMedIds: ["lamictal"] }, version: 0 }),
    );

    useLowStockNoticeStore.persist.rehydrate();

    expect(useLowStockNoticeStore.getState().dismissedMedIds).toEqual(["lamictal"]);
  });
});
