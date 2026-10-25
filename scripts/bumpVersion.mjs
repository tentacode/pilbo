import { readFileSync, writeFileSync } from "node:fs";

const CONFIG_PATH = "app.config.ts";
const VERSION_PATTERN = /version: "(\d+)\.(\d+)\.(\d+)"/;
const BUMPS = {
  major: ([major]) => [major + 1, 0, 0],
  minor: ([major, minor]) => [major, minor + 1, 0],
  patch: ([major, minor, patch]) => [major, minor, patch + 1],
};

const type = process.argv[2];
if (!Object.hasOwn(BUMPS, type ?? "")) {
  console.error("Usage: make version-bump TYPE=major|minor|patch");
  process.exit(1);
}

const config = readFileSync(CONFIG_PATH, "utf8");
const match = config.match(VERSION_PATTERN);
if (match === null) {
  console.error(`No version found in ${CONFIG_PATH}`);
  process.exit(1);
}

const version = BUMPS[type](match.slice(1).map(Number)).join(".");
writeFileSync(CONFIG_PATH, config.replace(VERSION_PATTERN, `version: "${version}"`));
console.log(`Version: ${match.slice(1).join(".")} → ${version}`);
