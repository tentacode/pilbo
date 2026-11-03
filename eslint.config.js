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
            "Property[key.name=/^(border[A-Za-z]*Color|outlineColor|shadowColor)$/] > MemberExpression.value[object.name='colors']",
          message:
            "React Native resolves dynamic colors with the system theme on borders, outlines and shadows: use createThemedStyles and themeColors instead.",
        },
      ],
    },
  },
  {
    ignores: ["ios/*", "android/*", ".expo/*", "dist/*", "src/shared/database/migrations/*"],
  },
]);
