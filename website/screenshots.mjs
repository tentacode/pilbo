import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const WEBSITE_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const SOURCE_DIRECTORY = join(WEBSITE_DIRECTORY, "..", "store", "screenshots", "screenshots");
const OUTPUT_DIRECTORY = join(WEBSITE_DIRECTORY, "src", "static", "screenshots");
const LANGUAGES = ["en", "fr"];
const WIDTH = 600;

const SCREENSHOTS = {
  today: "01-today.png",
  reminders: "02-reminders.png",
  pillbox: "03-pillbox.png",
  pills: "03-pills.png",
  stocks: "04-stocks.png",
  calendar: "05-calendar.png",
};

const missing = LANGUAGES.flatMap((language) =>
  Object.values(SCREENSHOTS)
    .map((file) => join(SOURCE_DIRECTORY, language, file))
    .filter((path) => !existsSync(path)),
);
if (missing.length > 0) {
  console.error(`Missing screenshots (see store/screenshots/README.md):\n${missing.join("\n")}`);
  process.exit(1);
}

for (const language of LANGUAGES) {
  mkdirSync(join(OUTPUT_DIRECTORY, language), { recursive: true });
  for (const [name, file] of Object.entries(SCREENSHOTS)) {
    const output = join(OUTPUT_DIRECTORY, language, `${name}.webp`);
    execFileSync("magick", [
      join(SOURCE_DIRECTORY, language, file),
      ...["-resize", `${WIDTH}x`, "-strip", "-quality", "82"],
      output,
    ]);
    console.log(`Generated ${output}`);
  }
}
