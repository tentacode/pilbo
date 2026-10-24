import type { Med } from "./med";

export interface Stock {
  medId: string;
  quantity: number;
  boxSize: number;
  lowStockDays: number;
}

export interface MedStock {
  med: Med;
  stock: Stock;
}

export const STOCK_QUANTITY = { minimum: 0, maximum: 9999, default: 0 } as const;

export const BOX_SIZE = { minimum: 1, maximum: 999, default: 30 } as const;
