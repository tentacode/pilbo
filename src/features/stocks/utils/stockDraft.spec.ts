import { addBox, createStockDraft, isStockDraftDirty, parseBoxSize, toStock } from "./stockDraft";

const existingStock = { medId: "lithium", quantity: -3, boxSize: 28, lowStockDays: 5 };

describe("stockDraft", () => {
  it("starts a new stock at 0 pills, a box of 30 and the default threshold", () => {
    expect(createStockDraft("lithium", undefined, 10)).toEqual({
      medId: "lithium",
      quantity: 0,
      boxSizeText: "30",
      lowStockDays: 10,
    });
  });

  it("starts from an existing stock, negative quantity included", () => {
    expect(createStockDraft("lithium", existingStock, 10)).toEqual({
      medId: "lithium",
      quantity: -3,
      boxSizeText: "28",
      lowStockDays: 5,
    });
  });

  it("parses a box size between 1 and 999", () => {
    expect(parseBoxSize("28")).toBe(28);
    expect(parseBoxSize("999")).toBe(999);
    expect(parseBoxSize("")).toBeUndefined();
    expect(parseBoxSize("0")).toBeUndefined();
    expect(parseBoxSize("1000")).toBeUndefined();
    expect(parseBoxSize("2.5")).toBeUndefined();
  });

  it("adds a box to the quantity, up to 9999", () => {
    const draft = createStockDraft("lithium", existingStock, 7);

    expect(addBox(draft).quantity).toBe(25);
    expect(addBox({ ...draft, quantity: 9990 }).quantity).toBe(9999);
    expect(addBox({ ...draft, boxSizeText: "" })).toEqual({ ...draft, boxSizeText: "" });
  });

  it("detects the unsaved changes", () => {
    const draft = createStockDraft("lithium", existingStock, 7);

    expect(isStockDraftDirty(draft, draft)).toBe(false);
    expect(isStockDraftDirty({ ...draft, quantity: 0 }, draft)).toBe(true);
    expect(isStockDraftDirty({ ...draft, boxSizeText: "30" }, draft)).toBe(true);
    expect(isStockDraftDirty({ ...draft, lowStockDays: 8 }, draft)).toBe(true);
  });

  it("converts to a stock only with a valid box size", () => {
    const draft = createStockDraft("lithium", existingStock, 7);

    expect(toStock(draft)).toEqual(existingStock);
    expect(toStock({ ...draft, boxSizeText: "0" })).toBeUndefined();
  });
});
