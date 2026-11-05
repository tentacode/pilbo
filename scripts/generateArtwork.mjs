import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { artworkConfig } from "../assets/artwork/config.ts";

const SETTINGS = {
  monochromeRatio: 1 / 3,
  jitter: 14,
  lightness: -0.06,
  roseHue: 350,
  backgroundOpacity: 0.6,
  backgroundOutlineOpacity: 1,
  backgroundOutlineWidth: 1.8,
  heroAngle: -45,
  splashWidth: 1290,
  splashHeight: 2796,
  splashDarkOpacity: 0.35,
};

const ICON_SIZE = 1024;
const COLORS = {
  background: artworkConfig.background,
  darkBackground: artworkConfig.darkBackground,
  ink: "#2E2A5C",
  highlight: "#FFFFFF",
};
const SWATCHES = ["#FFFFFF", "#FBE29A", "#F8C6DA", "#D6C9F5", "#C4DDF7", "#B3E8E0"];

const OUTLINE = `fill="none" stroke="${COLORS.ink}" stroke-opacity="${SETTINGS.backgroundOutlineOpacity}" stroke-width="${SETTINGS.backgroundOutlineWidth}" stroke-linejoin="round"`;
const JUNCTION = `fill="none" stroke="${COLORS.ink}" stroke-opacity="${SETTINGS.backgroundOutlineOpacity}" stroke-width="${SETTINGS.backgroundOutlineWidth * 0.8}"`;
const SCORE_LINE = `fill="none" stroke="${COLORS.ink}" stroke-opacity="0.35" stroke-width="1.6" stroke-linecap="round"`;
const HIGHLIGHT = `fill="none" stroke="${COLORS.highlight}" stroke-width="2.2" stroke-linecap="round" opacity="0.9"`;

const SHAPES = {
  round: ([top, bottom]) => `
    <circle cx="20" cy="20" r="13" fill="${bottom}"/>
    <path d="M7 20a13 13 0 0 1 26 0z" fill="${top}"/>
    <circle cx="20" cy="20" r="13" ${OUTLINE}/>
    <path d="M11 20h18" ${SCORE_LINE}/>
    <path d="M12.8 14.6a9 9 0 0 1 4.6-3.9" ${HIGHLIGHT}/>`,
  oval: ([first, second]) => `
    <rect x="5" y="13" width="30" height="14" rx="7" fill="${second}"/>
    <path d="M20 13h-8a7 7 0 0 0 0 14h8z" fill="${first}"/>
    <rect x="5" y="13" width="30" height="14" rx="7" ${OUTLINE}/>
    <path d="M20 16v8" ${SCORE_LINE}/>
    <path d="M10.5 17.3h5" ${HIGHLIGHT}/>`,
  capsule: ([first, second]) => `
    <path d="M20 13.5h-7.5a6.5 6.5 0 0 0 0 13H20z" fill="${first}"/>
    <path d="M20 13.5h7.5a6.5 6.5 0 0 1 0 13H20z" fill="${second}"/>
    <rect x="6" y="13.5" width="28" height="13" rx="6.5" ${OUTLINE}/>
    <path d="M20 13.5v13" ${JUNCTION}/>
    <path d="M10.5 17.2h5" ${HIGHLIGHT}/>`,
  softgel: ([first, second]) => `
    <ellipse cx="20" cy="20" rx="12" ry="8.5" fill="${second}"/>
    <path d="M20 11.5a12 8.5 0 0 0 0 17z" fill="${first}"/>
    <ellipse cx="20" cy="20" rx="12" ry="8.5" ${OUTLINE}/>
    <ellipse cx="17.8" cy="15.5" rx="3.4" ry="1.7" fill="${COLORS.highlight}" opacity="0.8"/>`,
  triangle: ([first, second]) => `
    <path d="M15.67 11.33a5 5 0 0 1 8.66 0l5.34 9.25a5 5 0 0 1-4.33 7.5h-10.68a5 5 0 0 1-4.33-7.5z" fill="${second}"/>
    <path d="M20 8.83a5 5 0 0 0-4.33 2.5l-5.34 9.25a5 5 0 0 0 4.33 7.5H20z" fill="${first}"/>
    <path d="M15.67 11.33a5 5 0 0 1 8.66 0l5.34 9.25a5 5 0 0 1-4.33 7.5h-10.68a5 5 0 0 1-4.33-7.5z" ${OUTLINE}/>
    <path d="M17.45 15.25l-2 3.46" ${HIGHLIGHT}/>`,
  square: ([first, second]) => `
    <rect x="10" y="10" width="20" height="20" rx="5" fill="${second}"/>
    <path d="M20 10h-5a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h5z" fill="${first}"/>
    <rect x="10" y="10" width="20" height="20" rx="5" ${OUTLINE}/>
    <path d="M13.5 13.5h3.5" ${HIGHLIGHT}/>`,
};

const CAPSULE_OUTLINE_PATH = "M12.5 13.5h15a6.5 6.5 0 0 1 0 13h-15a6.5 6.5 0 0 1 0-13z";

function createRandom(seed) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(artworkConfig.seed);
function toHsl(hex) {
  const [red, green, blue] = [1, 3, 5].map(
    (index) => parseInt(hex.slice(index, index + 2), 16) / 255,
  );
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const lightness = (maximum + minimum) / 2;
  const delta = maximum - minimum;
  if (delta === 0) {
    return [0, 0, lightness];
  }
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const hueSector =
    maximum === red
      ? ((green - blue) / delta) % 6
      : maximum === green
        ? (blue - red) / delta + 2
        : (red - green) / delta + 4;
  return [(hueSector * 60 + 360) % 360, saturation, lightness];
}

function toHex([hue, saturation, lightness]) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const channel = (offset) => {
    const position = (offset + hue / 30) % 12;
    const value = lightness - (chroma / 2) * Math.max(-1, Math.min(position - 3, 9 - position, 1));
    return Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
}

function isRose(hue) {
  return hue >= 300 || hue < 20;
}

const clamp = (value) => Math.max(0, Math.min(1, value));

function saturate(hex, saturationFactor) {
  if (saturationFactor === 1) {
    return hex;
  }
  const [hue, saturation, lightness] = toHsl(hex);
  return toHex([hue, clamp(saturation * saturationFactor), lightness]);
}

function intensify(hex, saturationFactor, lightnessShift) {
  const [hue, saturation, lightness] = toHsl(hex);
  if (saturation === 0) {
    return hex;
  }
  return toHex([
    isRose(hue) ? SETTINGS.roseHue : hue,
    clamp(saturation * saturationFactor),
    clamp(lightness + lightnessShift),
  ]);
}

const ICON_SWATCHES = SWATCHES.map((color) =>
  intensify(color, artworkConfig.pills.saturation, SETTINGS.lightness),
);

const pick = (items) => items[Math.floor(random() * items.length)];
const pickOther = (items, excluded) => pick(items.filter((item) => item !== excluded));

function pillColors(previousColor) {
  const first = pickOther(ICON_SWATCHES, previousColor);
  const second = random() < SETTINGS.monochromeRatio ? first : pickOther(ICON_SWATCHES, first);
  return [first, second];
}

function backgroundPills({ width, height, pillsPerRow, scaleRange, opacity }) {
  const cellSize = width / pillsPerRow;
  const rowHeight = cellSize * 0.866;
  const columns = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / rowHeight) + 1;
  const shapeNames = Object.keys(SHAPES);
  const pills = [];
  let previousColor;
  for (let row = 0; row < rows; row++) {
    const offset = row % 2 === 0 ? 0 : cellSize / 2;
    for (let column = -1; column <= columns; column++) {
      const centerX = column * cellSize + offset + (random() - 0.5) * 2 * SETTINGS.jitter;
      const centerY = row * rowHeight + (random() - 0.5) * 2 * SETTINGS.jitter;
      const rotation = Math.round(random() * 360);
      const [minimumScale, maximumScale] = scaleRange;
      const scale = minimumScale + random() * (maximumScale - minimumScale);
      const colors = pillColors(previousColor);
      previousColor = colors[0];
      const shape = SHAPES[pick(shapeNames)](colors);
      pills.push(
        `<g transform="translate(${centerX.toFixed(1)} ${centerY.toFixed(1)}) rotate(${rotation}) scale(${scale.toFixed(2)}) translate(-20 -20)">${shape}</g>`,
      );
    }
  }
  return `<g opacity="${opacity}">${pills.join("")}</g>`;
}

function heroPill({ centerX, centerY, scale }) {
  const [first, second] = artworkConfig.hero.colors.map((color) =>
    saturate(color, artworkConfig.hero.saturation),
  );
  const transform = `translate(${centerX} ${centerY}) rotate(${SETTINGS.heroAngle}) scale(${scale}) translate(-20 -20)`;
  return `
  <g transform="${transform}">
    <path d="${CAPSULE_OUTLINE_PATH}" transform="translate(0.8 1.2)" fill="${COLORS.ink}" opacity="0.35"/>
    <path d="M20 13.5h-7.5a6.5 6.5 0 0 0 0 13H20z" fill="${first}"/>
    <path d="M20 13.5h7.5a6.5 6.5 0 0 1 0 13H20z" fill="${second}"/>
    <path d="${CAPSULE_OUTLINE_PATH}" fill="none" stroke="${COLORS.ink}" stroke-width="0.9" stroke-linejoin="round"/>
    <path d="M20 13.5v13" fill="none" stroke="${COLORS.ink}" stroke-width="0.8"/>
    <path d="M10.5 17.2h5" fill="none" stroke="${COLORS.highlight}" stroke-width="1.3" stroke-linecap="round" opacity="0.9"/>
  </g>`;
}

function svg({ width, height, background, content }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${background}"/>
  ${content}
</svg>
`;
}

const DEV_BANNER_TOP = 784;
const DEV_BANNER = `
  <rect y="${DEV_BANNER_TOP}" width="${ICON_SIZE}" height="${ICON_SIZE - DEV_BANNER_TOP}" fill="${COLORS.ink}"/>
  <text x="512" y="958" text-anchor="middle" font-family="-apple-system, Helvetica, Arial, sans-serif" font-size="180" font-weight="800" letter-spacing="24" fill="#FFFFFF">DEV</text>`;

function icon() {
  const pills = backgroundPills({
    width: ICON_SIZE,
    height: ICON_SIZE,
    pillsPerRow: artworkConfig.icon.pillsPerRow,
    scaleRange: artworkConfig.icon.pillSize,
    opacity: SETTINGS.backgroundOpacity,
  });
  const variant = (heroCenterY, banner = "") => {
    const hero = heroPill({
      centerX: ICON_SIZE / 2,
      centerY: heroCenterY,
      scale: artworkConfig.icon.heroSize,
    });
    return svg({
      width: ICON_SIZE,
      height: ICON_SIZE,
      background: COLORS.background,
      content: pills + hero + banner,
    });
  };
  return {
    regular: variant(ICON_SIZE / 2),
    dev: variant(DEV_BANNER_TOP / 2, DEV_BANNER),
  };
}

function splash() {
  const { splashWidth: width, splashHeight: height } = SETTINGS;
  const pills = backgroundPills({
    width,
    height,
    pillsPerRow: artworkConfig.splash.pillsPerRow,
    scaleRange: artworkConfig.splash.pillSize,
    opacity: "OPACITY",
  });
  const hero = heroPill({
    centerX: width / 2,
    centerY: height / 2,
    scale: artworkConfig.splash.heroSize,
  });
  const variant = (background, opacity) =>
    svg({ width, height, background, content: pills.replace("OPACITY", opacity) + hero });
  return {
    light: variant(COLORS.background, SETTINGS.backgroundOpacity),
    dark: variant(COLORS.darkBackground, SETTINGS.splashDarkOpacity),
  };
}

function renderPng({ source, output, width, height, background }) {
  const size = Math.max(width, height);
  const offsetX = (size - width) / 2;
  const offsetY = (size - height) / 2;
  const squareSource = source.replace(
    `width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"`,
    `width="${size}" height="${size}" viewBox="${-offsetX} ${-offsetY} ${size} ${size}"`,
  );
  const directory = mkdtempSync(join(tmpdir(), "pilbo-artwork-"));
  const squarePath = join(directory, "artwork.svg");
  writeFileSync(squarePath, squareSource);
  execFileSync("qlmanage", ["-t", "-s", String(size), "-o", directory, squarePath], {
    stdio: "ignore",
  });
  execFileSync("magick", [
    `${squarePath}.png`,
    ...["-crop", `${width}x${height}+${offsetX}+${offsetY}`, "+repage"],
    ...["-background", background, "-alpha", "remove", "-alpha", "off"],
    output,
  ]);
}

const iconSources = icon();
const splashSources = splash();

const artworks = [
  { name: "icon", source: iconSources.regular, size: ICON_SIZE, background: COLORS.background },
  { name: "icon-dev", source: iconSources.dev, size: ICON_SIZE, background: COLORS.background },
  { name: "splash", source: splashSources.light, background: COLORS.background },
  { name: "splash-dark", source: splashSources.dark, background: COLORS.darkBackground },
];

for (const { name, source, size, background } of artworks) {
  const width = size ?? SETTINGS.splashWidth;
  const height = size ?? SETTINGS.splashHeight;
  writeFileSync(`assets/artwork/${name}.svg`, source);
  renderPng({ source, output: `assets/images/${name}.png`, width, height, background });
  console.log(`Generated assets/images/${name}.png`);
}
