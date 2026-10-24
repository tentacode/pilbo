import { BOX_SIZE, type Stock, STOCK_QUANTITY } from "@/domain/stock";

export type StockDraft = {
  medId: string;
  quantity: number;
  boxSizeText: string;
  lowStockDays: number;
};

export function createStockDraft(
  medId: string,
  stock: Stock | undefined,
  defaultLowStockDays: number,
): StockDraft {
  return {
    medId,
    quantity: stock?.quantity ?? STOCK_QUANTITY.default,
    boxSizeText: String(stock?.boxSize ?? BOX_SIZE.default),
    lowStockDays: stock?.lowStockDays ?? defaultLowStockDays,
  };
}

export function parseBoxSize(boxSizeText: string): number | undefined {
  if (!/^\d+$/.test(boxSizeText)) {
    return undefined;
  }
  const boxSize = Number(boxSizeText);
  return boxSize >= BOX_SIZE.minimum && boxSize <= BOX_SIZE.maximum ? boxSize : undefined;
}

export function addBox(draft: StockDraft): StockDraft {
  const boxSize = parseBoxSize(draft.boxSizeText);
  if (boxSize === undefined) {
    return draft;
  }
  return { ...draft, quantity: Math.min(STOCK_QUANTITY.maximum, draft.quantity + boxSize) };
}

export function isStockDraftDirty(draft: StockDraft, initialDraft: StockDraft): boolean {
  return (
    draft.quantity !== initialDraft.quantity ||
    draft.boxSizeText !== initialDraft.boxSizeText ||
    draft.lowStockDays !== initialDraft.lowStockDays
  );
}

export function toStock(draft: StockDraft): Stock | undefined {
  const boxSize = parseBoxSize(draft.boxSizeText);
  if (boxSize === undefined) {
    return undefined;
  }
  return {
    medId: draft.medId,
    quantity: draft.quantity,
    boxSize,
    lowStockDays: draft.lowStockDays,
  };
}
