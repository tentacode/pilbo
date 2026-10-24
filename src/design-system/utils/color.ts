export const HUE_MAXIMUM = 360;
export const INTENSITY_MAXIMUM = 100;
export const PASTEL_INTENSITY = 50;

const WHITE_LIGHTNESS = 100;
const PASTEL_LIGHTNESS = 86;
const DARKEST_LIGHTNESS = 18;
const PASTEL_SATURATION = 95;
const DARKEST_SATURATION = 45;
const HUE_TRACK_STEPS = 12;
const INTENSITY_TRACK_STEPS = 4;

type Hsl = { hue: number; saturation: number; lightness: number };

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function interpolate(from: number, to: number, ratio: number): number {
  return from + (to - from) * ratio;
}

function hslToHex({ hue, saturation, lightness }: Hsl): string {
  const saturationRatio = saturation / 100;
  const lightnessRatio = lightness / 100;
  const chroma = saturationRatio * Math.min(lightnessRatio, 1 - lightnessRatio);
  const channel = (offset: number) => {
    const hueSector = (offset + hue / 30) % 12;
    const value = lightnessRatio - chroma * Math.max(-1, Math.min(hueSector - 3, 9 - hueSector, 1));
    return Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase();
}

function hexToHsl(hex: string): Hsl {
  const [red, green, blue] = [1, 3, 5].map(
    (start) => parseInt(hex.slice(start, start + 2), 16) / 255,
  );
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const lightness = (maximum + minimum) / 2;
  const delta = maximum - minimum;
  if (delta === 0) {
    return { hue: 0, saturation: 0, lightness: lightness * 100 };
  }
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue: number;
  if (maximum === red) {
    hue = ((green - blue) / delta) % 6;
  } else if (maximum === green) {
    hue = (blue - red) / delta + 2;
  } else {
    hue = (red - green) / delta + 4;
  }
  return {
    hue: (hue * 60 + HUE_MAXIMUM) % HUE_MAXIMUM,
    saturation: saturation * 100,
    lightness: lightness * 100,
  };
}

export function colorFromHueAndIntensity(hue: number, intensity: number): string {
  const clampedIntensity = clamp(intensity, 0, INTENSITY_MAXIMUM);
  if (clampedIntensity <= PASTEL_INTENSITY) {
    const ratio = clampedIntensity / PASTEL_INTENSITY;
    return hslToHex({
      hue,
      saturation: PASTEL_SATURATION,
      lightness: interpolate(WHITE_LIGHTNESS, PASTEL_LIGHTNESS, ratio),
    });
  }
  const ratio = (clampedIntensity - PASTEL_INTENSITY) / (INTENSITY_MAXIMUM - PASTEL_INTENSITY);
  return hslToHex({
    hue,
    saturation: interpolate(PASTEL_SATURATION, DARKEST_SATURATION, ratio),
    lightness: interpolate(PASTEL_LIGHTNESS, DARKEST_LIGHTNESS, ratio),
  });
}

export function hueAndIntensityFromColor(hex: string): { hue: number; intensity: number } {
  const { hue, lightness } = hexToHsl(hex);
  if (lightness >= PASTEL_LIGHTNESS) {
    const ratio = (WHITE_LIGHTNESS - lightness) / (WHITE_LIGHTNESS - PASTEL_LIGHTNESS);
    return { hue: Math.round(hue), intensity: Math.round(ratio * PASTEL_INTENSITY) };
  }
  const ratio = clamp(
    (PASTEL_LIGHTNESS - lightness) / (PASTEL_LIGHTNESS - DARKEST_LIGHTNESS),
    0,
    1,
  );
  return {
    hue: Math.round(hue),
    intensity: Math.round(interpolate(PASTEL_INTENSITY, INTENSITY_MAXIMUM, ratio)),
  };
}

export function hueTrackColors(intensity: number): string[] {
  return Array.from({ length: HUE_TRACK_STEPS + 1 }, (_, index) =>
    colorFromHueAndIntensity((index * HUE_MAXIMUM) / HUE_TRACK_STEPS, intensity),
  );
}

export function intensityTrackColors(hue: number): string[] {
  return Array.from({ length: INTENSITY_TRACK_STEPS + 1 }, (_, index) =>
    colorFromHueAndIntensity(hue, (index * INTENSITY_MAXIMUM) / INTENSITY_TRACK_STEPS),
  );
}

function relativeLuminance(hex: string): number {
  const [red, green, blue] = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(firstHex: string, secondHex: string): number {
  const [lighter, darker] = [relativeLuminance(firstHex), relativeLuminance(secondHex)].sort(
    (first, second) => second - first,
  );
  return (lighter + 0.05) / (darker + 0.05);
}
