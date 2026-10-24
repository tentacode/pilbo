import { defineConfig } from "i18next-cli";

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

export default defineConfig({
  locales: ["fr", "en"],
  extract: {
    input: ["src/**/*.{ts,tsx}"],
    ignore: ["src/**/*.spec.{ts,tsx}"],
    output: "src/shared/i18n/locales/{{language}}/{{namespace}}.json",
    defaultNS: "common",
    keySeparator: false,
    nsSeparator: false,
    extractFromComments: false,
    removeUnusedKeys: true,
    defaultValue: (key, _namespace, language) =>
      language === "fr" ? key.replace(PLURAL_SUFFIX, "") : "",
  },
});
