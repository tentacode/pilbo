import { i18n } from "@/shared/i18n/i18n";

import { buildSupportMailUrl } from "./contactSupport";

const t = i18n.getFixedT(null, "common");

describe("buildSupportMailUrl", () => {
  it("targets the support address with an encoded subject", () => {
    expect(buildSupportMailUrl(t)).toBe(
      "mailto:pilbo@tentacode.dev?subject=Pilbo%20%3A%20probl%C3%A8me%20rencontr%C3%A9&body=",
    );
  });

  it("adds the technical details to the body", () => {
    const url = buildSupportMailUrl(t, "Disk full");

    expect(decodeURIComponent(url.split("&body=")[1])).toBe(
      "\n\n---\nDétail technique : Disk full",
    );
  });

  it("writes the e-mail in English", async () => {
    await i18n.changeLanguage("en");
    const url = buildSupportMailUrl(t, "Disk full");

    expect(decodeURIComponent(url.split("&body=")[0])).toBe(
      "mailto:pilbo@tentacode.dev?subject=Pilbo: issue encountered",
    );
    expect(decodeURIComponent(url.split("&body=")[1])).toBe(
      "\n\n---\nTechnical details: Disk full",
    );
  });
});
