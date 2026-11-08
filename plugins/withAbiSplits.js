const { withAppBuildGradle } = require("expo/config-plugins");

const MARKER = "// withAbiSplits";

// Release builds also produce a lighter arm64-only APK next to the universal one. Debug builds only
// compile the connected device's architecture, so splits stay disabled for them.
const ABI_SPLITS = `
    ${MARKER}
    splits {
        abi {
            enable gradle.startParameter.taskNames.any { it.contains("Release") }
            reset()
            include "arm64-v8a"
            universalApk true
        }
    }
`;

function addAbiSplits(buildGradle) {
  if (buildGradle.includes(MARKER)) {
    return buildGradle;
  }
  const withSplits = buildGradle.replace(/^android \{\n/m, `$&${ABI_SPLITS}`);
  if (withSplits === buildGradle) {
    throw new Error("withAbiSplits: android/app/build.gradle has an unexpected format");
  }
  return withSplits;
}

module.exports = function withAbiSplits(config) {
  return withAppBuildGradle(config, (modConfig) => {
    modConfig.modResults.contents = addAbiSplits(modConfig.modResults.contents);
    return modConfig;
  });
};
