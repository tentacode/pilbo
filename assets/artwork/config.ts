type Range = [minimum: number, maximum: number];

type ArtworkLayout = {
  heroSize: number;
  pillsPerRow: number;
  pillSize: Range;
};

export type ArtworkConfig = {
  seed: number;
  background: string;
  darkBackground: string;
  hero: { colors: [string, string]; saturation: number };
  pills: { saturation: number };
  icon: ArtworkLayout;
  adaptiveIcon: ArtworkLayout & { devHeroSize: number };
  splash: ArtworkLayout;
  androidSplash: { heroSize: number };
  featureGraphic: ArtworkLayout;
};

export const artworkConfig: ArtworkConfig = {
  /** Random seed: same value = same layout. Change it to reshuffle the background pills (positions, shapes, colors). */
  seed: 7,
  /** Background color of the icon and the light splash screen (hex). */
  background: "#D6C9F5",
  /** Background color of the dark splash screen (hex). */
  darkBackground: "#15122B",
  /** Central capsule, shared by the icon and the splash screens. */
  hero: {
    /** Colors of the two halves of the capsule [left, right] (hex), rendered as is when saturation is 1. */
    colors: ["#F58FB8", "#FFFFFF"],
    /** Saturation multiplier of hero.colors: 1 = exact colors, > 1 = more vivid, < 1 = duller. White is never affected. */
    saturation: 1.3,
  },
  /** Small background pills, shared by the icon and the splash screens. */
  pills: {
    /**
     * Saturation multiplier of the built-in pastel palette: > 1 = more vivid, < 1 = duller. White is never affected.
     * The palette is also slightly darkened and its pinks shifted to the same rose hue, so 1 is not the exact palette.
     */
    saturation: 1.35,
  },
  /** App icon, 1024 × 1024 px. */
  icon: {
    /** Size of the central capsule: scale factor of a 40-unit pill (22 ≈ 880 px wide). Higher = bigger. */
    heroSize: 23,
    /** Background density: pills per row, decimals allowed. Higher = more pills, closer together. */
    pillsPerRow: 3,
    /** Random size range of the background pills [minimum, maximum], same scale as heroSize. */
    pillSize: [3, 13],
  },
  /**
   * Android adaptive icon, 1024 × 1024 px layers: background (pills) and foreground (capsule, transparent).
   * The launcher crops the layers to its own shape and only the central 61 % is always visible,
   * so the capsule must fit in a circle of about 626 px.
   */
  adaptiveIcon: {
    /** Size of the central capsule, same scale as icon.heroSize. 22 touches the edge of the visible circle. */
    heroSize: 20,
    /** Size of the capsule of "Pilbo Dev", above the DEV banner. */
    devHeroSize: 15,
    /** Background density, higher than icon.pillsPerRow since only the center of the layer is visible. */
    pillsPerRow: 4.5,
    /** Random size range of the background pills, smaller than icon.pillSize for the same reason. */
    pillSize: [2, 8.7],
  },
  /** Light and dark splash screens, 1290 × 2796 px. */
  splash: {
    /** Size of the central capsule: scale factor of a 40-unit pill (20 ≈ 800 px wide). Higher = bigger. */
    heroSize: 22,
    /** Background density: pills per row, decimals allowed. Higher = more pills, closer together. */
    pillsPerRow: 4.7,
    /** Random size range of the background pills [minimum, maximum], same scale as heroSize. */
    pillSize: [4.8, 8.4],
  },
  /** Android splash screen (Android 12+ only shows a centered icon): capsule on a transparent 1024 × 1024 px image. */
  androidSplash: {
    /** Size of the capsule, same scale as icon.heroSize. */
    heroSize: 26,
  },
  /** Play Store feature graphic, 1024 × 500 px, without text. The Play Store icon (512 × 512 px) is the app icon, resized. */
  featureGraphic: {
    /** Size of the central capsule, same scale as icon.heroSize (12 ≈ 350 px tall once tilted). Higher = bigger. */
    heroSize: 12,
    /** Background density: pills per row, decimals allowed. Higher = more pills, closer together. */
    pillsPerRow: 6,
    /** Random size range of the background pills [minimum, maximum], same scale as heroSize. */
    pillSize: [3, 5.5],
  },
};
