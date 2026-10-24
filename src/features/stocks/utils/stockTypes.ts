import type { Med } from "@/domain/med";
import type { Stock } from "@/domain/stock";

import type { StockForecast } from "./stockForecast";

export type StockItem = {
  med: Med;
  stock: Stock;
  forecast: StockForecast;
};

export type StockSections = {
  low: StockItem[];
  sufficient: StockItem[];
};
