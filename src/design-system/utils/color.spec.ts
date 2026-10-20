import {
  colorFromHueAndIntensity,
  hueAndIntensityFromColor,
  hueTrackColors,
  intensityTrackColors,
} from "./color";

function lightnessOf(hex: string): number {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
  return (Math.max(...channels) + Math.min(...channels)) / 2 / 255;
}

describe("colorFromHueAndIntensity", () => {
  it("returns white at intensity 0", () => {
    expect(colorFromHueAndIntensity(200, 0)).toBe("#FFFFFF");
  });

  it("returns a pastel in the middle", () => {
    const pastel = colorFromHueAndIntensity(27, 50);

    expect(pastel).toMatch(/^#[0-9A-F]{6}$/);
    expect(lightnessOf(pastel)).toBeCloseTo(0.86, 1);
  });

  it("returns a light black at intensity 100", () => {
    const darkest = colorFromHueAndIntensity(27, 100);

    expect(lightnessOf(darkest)).toBeCloseTo(0.18, 1);
    expect(darkest).not.toBe("#000000");
  });

  it("gets darker as the intensity grows", () => {
    const lightnesses = [0, 25, 50, 75, 100].map((intensity) =>
      lightnessOf(colorFromHueAndIntensity(120, intensity)),
    );

    expect([...lightnesses].sort((first, second) => second - first)).toEqual(lightnesses);
  });

  it("clamps the intensity", () => {
    expect(colorFromHueAndIntensity(0, -10)).toBe("#FFFFFF");
    expect(colorFromHueAndIntensity(0, 150)).toBe(colorFromHueAndIntensity(0, 100));
  });
});

describe("hueAndIntensityFromColor", () => {
  it.each([
    [27, 30],
    [202, 50],
    [341, 80],
  ])("finds back the hue %i and the intensity %i", (hue, intensity) => {
    const found = hueAndIntensityFromColor(colorFromHueAndIntensity(hue, intensity));

    expect(Math.abs(found.hue - hue)).toBeLessThanOrEqual(2);
    expect(Math.abs(found.intensity - intensity)).toBeLessThanOrEqual(2);
  });

  it("places white at intensity 0", () => {
    expect(hueAndIntensityFromColor("#FFFFFF").intensity).toBe(0);
  });
});

describe("track colors", () => {
  it("goes around the hues at a fixed intensity", () => {
    const colors = hueTrackColors(50);

    expect(colors).toHaveLength(13);
    expect(colors[0]).toBe(colors[12]);
  });

  it("goes from white to the darkest color at a fixed hue", () => {
    const colors = intensityTrackColors(27);

    expect(colors[0]).toBe("#FFFFFF");
    expect(colors[colors.length - 1]).toBe(colorFromHueAndIntensity(27, 100));
  });
});
