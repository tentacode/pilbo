const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier/flat");

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "ImportDeclaration[source.value=/tokens$/] > ImportSpecifier[imported.name='colors']",
          message:
            "Colors depend on the theme: use createThemedStyles (styles) or useThemeColors (props) instead.",
        },
      ],
    },
  },
  {
    ignores: ["ios/*", "android/*", ".expo/*", "dist/*", "src/shared/database/migrations/*"],
  },
]);
