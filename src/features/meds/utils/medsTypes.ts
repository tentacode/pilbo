import type { Med } from "@/domain/med";
import type { Stock } from "@/domain/stock";

import type { StockForecast } from "@/features/stocks/utils/stockForecast";

export type MedStockStatus = {
  stock: Stock;
  forecast: StockForecast;
};

export type MedListItem = {
  med: Med;
  stockStatus?: MedStockStatus;
};
