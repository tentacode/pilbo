import type { MedQuantity } from "@/domain/med";

import { pillStackLayoutOf, pillStackWidth, visiblePillCount } from "./pillStack";

function medQuantity(quantity: number): MedQuantity {
  return {
    med: {
      id: `med-${quantity}`,
      name: "Lithium",
      strength: "250 mg",
      detail: "",
      design: { shape: "round", colors: ["#D6C9F5", "#D6C9F5"], size: "medium" },
      isAsNeeded: false,
    },
    quantity,
  };
}

describe("visiblePillCount", () => {
  it("shows between 1 and 4 pills", () => {
    expect(visiblePillCount(1)).toBe(1);
    expect(visiblePillCount(3)).toBe(3);
    expect(visiblePillCount(6)).toBe(4);
  });
});

describe("pillStackLayoutOf", () => {
  it("reserves the slots of the largest stack", () => {
    expect(pillStackLayoutOf([medQuantity(1), medQuantity(2)])).toEqual({
      pillSlotCount: 2,
      hasHiddenCountSlot: false,
    });
  });

  it("reserves the hidden count slot above 4 pills", () => {
    expect(pillStackLayoutOf([medQuantity(1), medQuantity(5)])).toEqual({
      pillSlotCount: 4,
      hasHiddenCountSlot: true,
    });
  });
});

describe("pillStackWidth", () => {
  it("adds the visible part of each overlapping pill", () => {
    expect(pillStackWidth(1, 36, 0.5)).toBe(36);
    expect(pillStackWidth(4, 36, 0.5)).toBe(90);
  });
});
