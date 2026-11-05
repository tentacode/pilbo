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
  splash: ArtworkLayout;
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
  /** Light and dark splash screens, 1290 × 2796 px. */
  splash: {
    /** Size of the central capsule: scale factor of a 40-unit pill (20 ≈ 800 px wide). Higher = bigger. */
    heroSize: 22,
    /** Background density: pills per row, decimals allowed. Higher = more pills, closer together. */
    pillsPerRow: 4.7,
    /** Random size range of the background pills [minimum, maximum], same scale as heroSize. */
    pillSize: [4.8, 8.4],
  },
};
