import { darkColors, lightColors, type ThemeColors } from "./tokens";
import { contrastRatio } from "./utils/color";

type ColorName = keyof ThemeColors;

const TEXT_MINIMUM_CONTRAST = 4.5;
const GRAPHIC_MINIMUM_CONTRAST = 3;

const TEXT_PAIRS: [ColorName, ColorName[]][] = [
  [
    "ink",
    [
      "background",
      "surface",
      "fill",
      "accentSoft",
      "roseSoft",
      "butterSoft",
      "turquoiseSoft",
      "alertBackground",
      "doneBackground",
      "skipChip",
      "successChip",
      "warningChip",
    ],
  ],
  ["inkSecondary", ["background", "surface", "fill", "accentSoft", "doneBackground", "skipChip"]],
  ["onInk", ["ink", "inkPressed"]],
  ["onProminent", ["prominentBackground", "prominentBackgroundPressed"]],
  ["inkSecondary", ["alertBackground"]],
  ["alertInk", ["background", "surface", "alertBackground"]],
  ["onAlert", ["alertChip", "alertNotice", "alertNoticePressed"]],
  ["successInk", ["background", "surface", "successChip"]],
  ["warningInk", ["background", "surface", "warningChip"]],
  ["turquoiseInk", ["surface", "turquoiseSoft"]],
];

const GRAPHIC_PAIRS: [ColorName, ColorName[]][] = [
  ["ink", ["background", "surface", "fill"]],
  ["prominentBorder", ["alertBackground"]],
  ["inkSecondary", ["progressTrack"]],
  ["alertInk", ["surface", "progressTrack"]],
  ["onAccent", ["turquoise", "lavender", "butter", "rose"]],
];

function toCases(pairs: [ColorName, ColorName[]][]): [ColorName, ColorName][] {
  return pairs.flatMap(([foreground, backgrounds]) =>
    backgrounds.map((background): [ColorName, ColorName] => [foreground, background]),
  );
}

describe.each([
  ["light", lightColors],
  ["dark", darkColors],
])("%s palette", (_, palette) => {
  it.each(toCases(TEXT_PAIRS))("has an AA text contrast for %s on %s", (foreground, background) => {
    expect(contrastRatio(palette[foreground], palette[background])).toBeGreaterThanOrEqual(
      TEXT_MINIMUM_CONTRAST,
    );
  });

  it.each(toCases(GRAPHIC_PAIRS))(
    "has an AA graphic contrast for %s on %s",
    (foreground, background) => {
      expect(contrastRatio(palette[foreground], palette[background])).toBeGreaterThanOrEqual(
        GRAPHIC_MINIMUM_CONTRAST,
      );
    },
  );
});

describe("theme palettes", () => {
  it("define the same colors", () => {
    expect(Object.keys(darkColors).sort()).toEqual(Object.keys(lightColors).sort());
  });
});
