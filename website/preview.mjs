import { createReadStream, existsSync, statSync, watch } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { OUTPUT_DIRECTORY, SOURCE_DIRECTORY, build } from "./build.mjs";

const PORT = Number(process.env.PORT ?? 4000);
const BASE_PATH = "/pilbo/";

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
};

function rebuild() {
  try {
    build();
    console.log(`Website generated (${new Date().toLocaleTimeString()})`);
  } catch (error) {
    console.error(error.message);
  }
}

function resolveFile(urlPath) {
  const relativePath = normalize(decodeURIComponent(urlPath.slice(BASE_PATH.length)));
  if (relativePath.startsWith("..")) {
    return undefined;
  }
  const path = join(OUTPUT_DIRECTORY, relativePath);
  if (!existsSync(path)) {
    return undefined;
  }
  return statSync(path).isDirectory() ? join(path, "index.html") : path;
}

rebuild();

let rebuildTimeout;
watch(SOURCE_DIRECTORY, { recursive: true }, () => {
  clearTimeout(rebuildTimeout);
  rebuildTimeout = setTimeout(rebuild, 100);
});

createServer((request, response) => {
  const urlPath = new URL(request.url, "http://localhost").pathname;
  if (!urlPath.startsWith(BASE_PATH)) {
    response.writeHead(302, { Location: BASE_PATH }).end();
    return;
  }
  if (urlPath !== BASE_PATH && !extname(urlPath) && !urlPath.endsWith("/")) {
    response.writeHead(301, { Location: `${urlPath}/` }).end();
    return;
  }
  const file = resolveFile(urlPath);
  if (!file || !existsSync(file)) {
    response.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
    return;
  }
  response.writeHead(200, {
    "Content-Type": CONTENT_TYPES[extname(file)] ?? "application/octet-stream",
    "Cache-Control": "no-store",
  });
  createReadStream(file).pipe(response);
}).listen(PORT, () => {
  console.log(`Preview on http://localhost:${PORT}${BASE_PATH} (Ctrl+C to stop)`);
});
