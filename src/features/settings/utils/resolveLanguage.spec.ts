import { resolveLanguage } from "./resolveLanguage";

describe("resolveLanguage", () => {
  it("uses the chosen language", () => {
    expect(resolveLanguage("en", ["fr"])).toBe("en");
  });

  it("uses the first supported system language", () => {
    expect(resolveLanguage(null, ["de", null, "fr", "en"])).toBe("fr");
  });

  it("falls back to English", () => {
    expect(resolveLanguage(null, ["de", "es"])).toBe("en");
  });

  it("falls back to English without system languages", () => {
    expect(resolveLanguage(null, [])).toBe("en");
  });
});
