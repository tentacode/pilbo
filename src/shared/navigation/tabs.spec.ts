import { tabs } from "./tabs";

describe("tabs", () => {
  it("formats the badge of the stocks tab", () => {
    expect(tabs.stocks.formatBadgeLabel?.(1)).toBe("1 stock bas");
    expect(tabs.stocks.formatBadgeLabel?.(2)).toBe("2 stocks bas");
  });
});
