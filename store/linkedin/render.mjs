#!/usr/bin/env node
// Renders the LinkedIn images with a headless Chrome (no npm dependency).
// Usage: node store/linkedin/render.mjs [--variant testers,pills]
import { execFile } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = dirname(fileURLToPath(import.meta.url));

await import(pathToFileURL(join(root, "variants.js")).href);
const config = globalThis.linkedinVariants;

const variantOptionIndex = process.argv.indexOf("--variant");
const variantIds =
  variantOptionIndex === -1
    ? config.variants.map((variant) => variant.id)
    : process.argv[variantOptionIndex + 1].split(",");
const variants = config.variants.filter((variant) => variantIds.includes(variant.id));

const chromeCandidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = chromeCandidates.find((candidate) => existsSync(candidate));

if (!chrome) {
  console.error("No Chrome found. Install Google Chrome or set CHROME_PATH.");
  process.exit(1);
}

const screenshotsDirectory = join(root, "..", "screenshots", "screenshots", config.language);
const missing = [
  ...new Set(variants.flatMap((variant) => variant.phones.map((phone) => phone.screenshot))),
]
  .map((screenshot) => join(screenshotsDirectory, screenshot))
  .filter((path) => !existsSync(path));
if (missing.length > 0) {
  console.error("Missing screenshots:");
  missing.forEach((path) => console.error(`  ${relative(process.cwd(), path)}`));
  process.exit(1);
}

const { width, height, scale } = config.canvas;
const outputDirectory = join(root, "output");
mkdirSync(outputDirectory, { recursive: true });

for (const variant of variants) {
  const url = new URL(pathToFileURL(join(root, "template.html")));
  url.searchParams.set("variant", variant.id);
  url.searchParams.set("mode", "render");

  const position = config.variants.indexOf(variant) + 1;
  const output = join(outputDirectory, `${String(position).padStart(2, "0")}-${variant.id}.png`);

  await run(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--allow-file-access-from-files",
    `--force-device-scale-factor=${scale}`,
    `--window-size=${width},${height}`,
    "--virtual-time-budget=5000",
    `--screenshot=${output}`,
    ...(process.env.CHROME_FLAGS?.split(" ") ?? []),
    url.href,
  ]);
  console.log(`✓ ${relative(process.cwd(), output)}`);
}
