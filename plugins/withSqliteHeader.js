const { withPodfile } = require("expo/config-plugins");

const MARKER = "# withSqliteHeader";

// The ExpoSQLite umbrella header imports "sqlite3.h", which recent Xcode SDKs resolve to the system
// header instead of the vendored one, so Swift cannot find the prefixed exsqlite3_* symbols.
const PATCH = `
    ${MARKER}
    sqlite_umbrella_header = File.join(installer.sandbox.root, 'Target Support Files', 'ExpoSQLite', 'ExpoSQLite-umbrella.h')
    if File.exist?(sqlite_umbrella_header)
      content = File.read(sqlite_umbrella_header)
      File.write(sqlite_umbrella_header, content.gsub('#import "sqlite3.h"', '#import <ExpoSQLite/sqlite3.h>'))
    end`;

module.exports = function withSqliteHeader(config) {
  return withPodfile(config, (modConfig) => {
    const podfile = modConfig.modResults.contents;
    if (!podfile.includes(MARKER)) {
      modConfig.modResults.contents = podfile.replace(
        /post_install do \|installer\|/,
        (match) => `${match}${PATCH}`,
      );
    }
    return modConfig;
  });
};
