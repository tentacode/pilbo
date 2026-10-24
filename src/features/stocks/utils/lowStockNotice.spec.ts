import { isLowStockNoticeVisible, keepLowStockMedIds } from "./lowStockNotice";

describe("isLowStockNoticeVisible", () => {
  it("is hidden without low stock", () => {
    expect(isLowStockNoticeVisible([], [])).toBe(false);
  });

  it("is visible when a low stock is not dismissed", () => {
    expect(isLowStockNoticeVisible(["lithium", "lamictal"], ["lithium"])).toBe(true);
  });

  it("is hidden when every low stock is dismissed", () => {
    expect(isLowStockNoticeVisible(["lithium"], ["lithium", "lamictal"])).toBe(false);
  });
});

describe("keepLowStockMedIds", () => {
  it("forgets the meds that are no longer low", () => {
    expect(keepLowStockMedIds(["lithium", "lamictal"], ["lamictal", "prazepam"])).toEqual([
      "lamictal",
    ]);
  });
});
