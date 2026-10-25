#!/usr/bin/env node
// Renders the App Store slides with a headless Chrome (no npm dependency).
// Usage: node store/screenshots/render.mjs [--lang fr,en] [--slide today,stocks] [--empty]
import { execFile } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = dirname(fileURLToPath(import.meta.url));

await import(pathToFileURL(join(root, "slides.js")).href);
const config = globalThis.storeScreenshots;

function readListOption(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1].split(",");
}

const empty = process.argv.includes("--empty");
const languages = readListOption("lang") ?? config.languages;
const slideIds = readListOption("slide") ?? config.slides.map((slide) => slide.id);
const slides = config.slides.filter((slide) => slideIds.includes(slide.id));

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

if (!empty) {
  const missing = languages.flatMap((language) =>
    slides
      .map((slide) => join(root, "screenshots", language, slide.screenshot))
      .filter((path) => !existsSync(path)),
  );
  if (missing.length > 0) {
    console.error("Missing screenshots:");
    missing.forEach((path) => console.error(`  ${relative(process.cwd(), path)}`));
    console.error("Add them, or run with --empty to render the frames without screenshots.");
    process.exit(1);
  }
}

const { width, height } = config.canvas;

for (const language of languages) {
  const outputDirectory = join(root, empty ? "output-empty" : "output", language);
  mkdirSync(outputDirectory, { recursive: true });

  for (const [index, slide] of slides.entries()) {
    const url = new URL(pathToFileURL(join(root, "template.html")));
    url.searchParams.set("slide", slide.id);
    url.searchParams.set("lang", language);
    url.searchParams.set("mode", empty ? "empty" : "render");

    const position = config.slides.indexOf(slide) + 1;
    const output = join(outputDirectory, `${String(position).padStart(2, "0")}-${slide.id}.png`);

    await run(chrome, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      "--allow-file-access-from-files",
      "--force-device-scale-factor=1",
      `--window-size=${width},${height}`,
      "--virtual-time-budget=5000",
      `--screenshot=${output}`,
      ...(process.env.CHROME_FLAGS?.split(" ") ?? []),
      url.href,
    ]);
    console.log(`✓ ${relative(process.cwd(), output)}${index === slides.length - 1 ? "\n" : ""}`);
  }
}
