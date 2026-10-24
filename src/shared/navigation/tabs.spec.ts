import { i18n } from "@/shared/i18n/i18n";

import { tabs } from "./tabs";

const t = i18n.getFixedT(null, "common");

describe("tabs", () => {
  it("formats the badge of the stocks tab", () => {
    expect(tabs.stocks.formatBadgeLabel?.(t, 1)).toBe("1 stock bas");
    expect(tabs.stocks.formatBadgeLabel?.(t, 2)).toBe("2 stocks bas");
  });

  it("formats the badge of the today tab", () => {
    expect(tabs.today.formatBadgeLabel?.(t, 1)).toBe("1 prise à valider");
    expect(tabs.today.formatBadgeLabel?.(t, 3)).toBe("3 prises à valider");
  });

  it("translates the labels and badges in English", async () => {
    await i18n.changeLanguage("en");

    expect(tabs.today.formatLabel(t)).toBe("Today");
    expect(tabs.stocks.formatBadgeLabel?.(t, 1)).toBe("1 low stock");
    expect(tabs.stocks.formatBadgeLabel?.(t, 2)).toBe("2 low stocks");
  });
});
