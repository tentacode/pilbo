import { FALLBACK_LANGUAGE, i18n, setI18nLanguage } from "./i18n";

const TEST_NAMESPACE = "test";
const KEY_WITH_SEPARATORS = "Prise validée. Prochaine : 8:00";
const KEY_ONLY_IN_FRENCH = "Seulement en français";
const PLURAL_KEY = "{{count}} jours";

function translate(key: string, count?: number): string {
  return (i18n.t as (key: string, options: { ns: string; count?: number }) => string)(key, {
    ns: TEST_NAMESPACE,
    count,
  });
}

describe("i18n", () => {
  beforeAll(() => {
    i18n.addResourceBundle("fr", TEST_NAMESPACE, {
      [KEY_WITH_SEPARATORS]: KEY_WITH_SEPARATORS,
      [KEY_ONLY_IN_FRENCH]: KEY_ONLY_IN_FRENCH,
      [`${PLURAL_KEY}_one`]: "{{count}} jour",
      [`${PLURAL_KEY}_other`]: PLURAL_KEY,
    });
    i18n.addResourceBundle("en", TEST_NAMESPACE, {
      [KEY_WITH_SEPARATORS]: "Intake taken. Next: 8:00",
      [KEY_ONLY_IN_FRENCH]: "",
      [`${PLURAL_KEY}_one`]: "{{count}} day",
      [`${PLURAL_KEY}_other`]: "{{count}} days",
    });
  });

  afterAll(() => {
    i18n.removeResourceBundle("fr", TEST_NAMESPACE);
    i18n.removeResourceBundle("en", TEST_NAMESPACE);
  });

  it("is initialized synchronously in French", () => {
    expect(i18n.isInitialized).toBe(true);
    expect(i18n.language).toBe(FALLBACK_LANGUAGE);
  });

  it("accepts keys with dots and colons", () => {
    expect(translate(KEY_WITH_SEPARATORS)).toBe(KEY_WITH_SEPARATORS);

    setI18nLanguage("en");

    expect(translate(KEY_WITH_SEPARATORS)).toBe("Intake taken. Next: 8:00");
  });

  it("falls back to French when the English translation is empty", () => {
    setI18nLanguage("en");

    expect(translate(KEY_ONLY_IN_FRENCH)).toBe(KEY_ONLY_IN_FRENCH);
  });

  it("uses the French plural rules", () => {
    expect(translate(PLURAL_KEY, 0)).toBe("0 jour");
    expect(translate(PLURAL_KEY, 1)).toBe("1 jour");
    expect(translate(PLURAL_KEY, 2)).toBe("2 jours");
  });

  it("uses the English plural rules", () => {
    setI18nLanguage("en");

    expect(translate(PLURAL_KEY, 0)).toBe("0 days");
    expect(translate(PLURAL_KEY, 1)).toBe("1 day");
    expect(translate(PLURAL_KEY, 2)).toBe("2 days");
  });
});
