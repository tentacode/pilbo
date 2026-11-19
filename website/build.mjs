import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const WEBSITE_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const SOURCE_DIRECTORY = join(WEBSITE_DIRECTORY, "src");
const OUTPUT_DIRECTORY = join(WEBSITE_DIRECTORY, "dist");
const SITE_URL = "https://tentacode.github.io/pilbo/";

const LANGUAGES = [
  { code: "en", directory: "" },
  { code: "fr", directory: "fr/" },
];

const PAGES = [
  { name: "index", path: "" },
  { name: "beta", path: "beta/" },
  { name: "support", path: "support/" },
  { name: "privacy", path: "privacy/" },
];

const TAG_PATTERN = /\{\{\s*(>?)\s*([\w.-]+)\s*\}\}/g;

function readText(path) {
  return readFileSync(path, "utf8");
}

function readPartials() {
  const directory = join(SOURCE_DIRECTORY, "partials");
  return Object.fromEntries(
    readdirSync(directory).map((file) => [
      basename(file, ".html"),
      readText(join(directory, file)).trim(),
    ]),
  );
}

function flattenKeys(value, prefix = "") {
  if (typeof value !== "object" || value === null) {
    return [prefix];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

function checkLocalesMatch(locales) {
  const [reference, ...others] = LANGUAGES.map(({ code }) => code);
  const referenceKeys = new Set(flattenKeys(locales[reference]));
  const errors = others.flatMap((code) => {
    const keys = new Set(flattenKeys(locales[code]));
    return [
      ...[...referenceKeys].filter((key) => !keys.has(key)).map((key) => `${code}: missing ${key}`),
      ...[...keys]
        .filter((key) => !referenceKeys.has(key))
        .map((key) => `${reference}: missing ${key}`),
    ];
  });
  if (errors.length > 0) {
    throw new Error(`Locales do not match:\n${errors.join("\n")}`);
  }
}

function lookup(context, key) {
  const value = key.split(".").reduce((current, part) => current?.[part], context);
  if (typeof value !== "string" && typeof value !== "number") {
    throw new Error(`Unknown key "${key}"`);
  }
  return String(value);
}

function render(template, context, partials, depth = 0) {
  if (depth > 10) {
    throw new Error("Partials are nested too deeply");
  }
  return template.replace(TAG_PATTERN, (_, isPartial, key) => {
    if (isPartial) {
      if (!(key in partials)) {
        throw new Error(`Unknown partial "${key}"`);
      }
      return render(partials[key], context, partials, depth + 1);
    }
    return render(lookup(context, key), context, partials, depth + 1);
  });
}

function relativeRoot(path) {
  const depth = path.split("/").filter(Boolean).length;
  return depth === 0 ? "./" : "../".repeat(depth);
}

function pageContext({ language, page, locale }) {
  const otherLanguage = LANGUAGES.find(({ code }) => code !== language.code);
  const path = `${language.directory}${page.path}`;
  const root = relativeRoot(path);
  const otherPath = `${otherLanguage.directory}${page.path}`;
  return {
    ...locale,
    page: locale.pages[page.name],
    language: language.code,
    otherLanguage: otherLanguage.code,
    root,
    homeUrl: `${root}${language.directory}`,
    canonicalUrl: `${SITE_URL}${path}`,
    alternateUrl: `${SITE_URL}${otherPath}`,
    alternateHref: `${root}${otherPath}`,
    siteUrl: SITE_URL,
    current: Object.fromEntries(
      PAGES.map(({ name }) => [name, name === page.name ? ' aria-current="page"' : ""]),
    ),
  };
}

export function build() {
  const partials = readPartials();
  const layout = readText(join(SOURCE_DIRECTORY, "layout.html"));
  const locales = Object.fromEntries(
    LANGUAGES.map(({ code }) => [
      code,
      JSON.parse(readText(join(SOURCE_DIRECTORY, "locales", `${code}.json`))),
    ]),
  );
  checkLocalesMatch(locales);

  rmSync(OUTPUT_DIRECTORY, { recursive: true, force: true });
  cpSync(join(SOURCE_DIRECTORY, "static"), OUTPUT_DIRECTORY, { recursive: true });

  for (const language of LANGUAGES) {
    for (const page of PAGES) {
      const context = pageContext({ language, page, locale: locales[language.code] });
      const content = readText(join(SOURCE_DIRECTORY, "pages", `${page.name}.html`));
      const html = render(
        layout.replace("{{ content }}", () => content),
        context,
        partials,
      );
      const directory = join(OUTPUT_DIRECTORY, language.directory, page.path);
      mkdirSync(directory, { recursive: true });
      writeFileSync(join(directory, "index.html"), html);
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    build();
    console.log(`Website generated in ${OUTPUT_DIRECTORY}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

export { OUTPUT_DIRECTORY, SOURCE_DIRECTORY };
