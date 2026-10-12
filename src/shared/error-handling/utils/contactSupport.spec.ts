import { buildSupportMailUrl } from "./contactSupport";

describe("buildSupportMailUrl", () => {
  it("targets the support address with an encoded subject", () => {
    expect(buildSupportMailUrl()).toBe(
      "mailto:pilbo@tentacode.dev?subject=Pilbo%20%3A%20probl%C3%A8me%20rencontr%C3%A9&body=",
    );
  });

  it("adds the technical details to the body", () => {
    const url = buildSupportMailUrl("Disk full");

    expect(decodeURIComponent(url.split("&body=")[1])).toBe(
      "\n\n---\nDétail technique : Disk full",
    );
  });
});
