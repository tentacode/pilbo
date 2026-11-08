const { withAppBuildGradle } = require("expo/config-plugins");

const MARKER = "// withReleaseSigning";

// The keystore stays outside the repository: Gradle reads it from the environment (.env, loaded by
// the Expo CLI), and only fails when a release build is actually requested without it.
const RELEASE_SIGNING_CONFIG = `
        ${MARKER}
        release {
            def releaseSigningVariables = ["ANDROID_KEYSTORE_PATH", "ANDROID_KEYSTORE_PASSWORD", "ANDROID_KEY_ALIAS", "ANDROID_KEY_PASSWORD"]
            def missingVariables = releaseSigningVariables.findAll { !System.getenv(it) }
            gradle.taskGraph.whenReady { graph ->
                if (!missingVariables.isEmpty() && graph.allTasks.any { it.name.contains("Release") }) {
                    throw new GradleException("Release signing: missing \${missingVariables.join(", ")} in .env, see docs/android_build.md")
                }
            }
            if (missingVariables.isEmpty()) {
                storeFile file(System.getenv("ANDROID_KEYSTORE_PATH"))
                storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
                keyAlias System.getenv("ANDROID_KEY_ALIAS")
                keyPassword System.getenv("ANDROID_KEY_PASSWORD")
            }
        }`;

function addReleaseSigning(buildGradle) {
  if (buildGradle.includes(MARKER)) {
    return buildGradle;
  }
  const withSigningConfig = buildGradle.replace(
    /(signingConfigs \{\n\s*debug \{[^}]*\})/,
    `$1${RELEASE_SIGNING_CONFIG}`,
  );
  const withReleaseBuildType = withSigningConfig.replace(
    /(release \{\n(?:\s*\/\/.*\n)*\s*)signingConfig signingConfigs\.debug/,
    "$1signingConfig signingConfigs.release",
  );
  if (withReleaseBuildType === withSigningConfig || withSigningConfig === buildGradle) {
    throw new Error("withReleaseSigning: android/app/build.gradle has an unexpected format");
  }
  return withReleaseBuildType;
}

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (modConfig) => {
    modConfig.modResults.contents = addReleaseSigning(modConfig.modResults.contents);
    return modConfig;
  });
};
