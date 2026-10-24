import { resolveColorScheme } from "./resolveColorScheme";

describe("resolveColorScheme", () => {
  it("uses the chosen color scheme", () => {
    expect(resolveColorScheme("light", "dark")).toBe("light");
    expect(resolveColorScheme("dark", "light")).toBe("dark");
  });

  it("follows the system color scheme", () => {
    expect(resolveColorScheme(null, "dark")).toBe("dark");
    expect(resolveColorScheme(null, "light")).toBe("light");
  });

  it("falls back to light", () => {
    expect(resolveColorScheme(null, "unspecified")).toBe("light");
  });
});
