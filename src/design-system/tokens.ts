export const colors = {
  ink: "#2E2A5C",
  inkPressed: "#211E46",
  inkSecondary: "#5C5780",
  background: "#FDFCFF",
  surface: "#FFFFFF",
  surfaceTranslucent: "rgba(255, 255, 255, 0.88)",
  line: "#E9E4F5",
  lineStrong: "#C9C1E0",
  fill: "#F3F0FA",
  separator: "#E4DFF0",
  accentSoft: "#EFEAFC",
  roseSoft: "#FDEAF2",
  butterSoft: "#FFF5D8",
  turquoiseSoft: "#E1F6F2",
  turquoise: "#B3E8E0",
  turquoiseInk: "#0B5A55",
  lavender: "#D6C9F5",
  butter: "#FBE29A",
  rose: "#F8C6DA",
  roseStrong: "#F58FB8",
  stepIndicatorInactive: "#D4CEE5",
  onInk: "#FFFFFF",
  alertBackground: "#FFE0DA",
  alertLine: "#FFCBC2",
  alertChip: "#FFCBC2",
  alertInk: "#8A2A1A",
  doneBackground: "#F2F1F5",
  doneLine: "#E4E1EA",
  skipLine: "#B9B2D0",
  skipChip: "#ECE8F5",
  successChip: "#DDF3E4",
  successInk: "#1E5A34",
  pillHighlight: "#FFFFFF",
  grabber: "#D3CEE2",
  stepperBorder: "#D6CFE7",
  backdrop: "rgba(46, 42, 92, 0.4)",
  swatchOutline: "rgba(46, 42, 92, 0.2)",
  colorDotOutline: "rgba(46, 42, 92, 0.28)",
  sliderOutline: "rgba(46, 42, 92, 0.14)",
} as const;

export const pillSwatches = {
  white: "#FFFFFF",
  yellow: "#FBE29A",
  pink: "#F8C6DA",
  lilac: "#D6C9F5",
  skyBlue: "#C4DDF7",
  mint: "#B3E8E0",
} as const;

export type PillSwatch = keyof typeof pillSwatches;

export const customColorWheel = [
  "#FFC8D9",
  "#FED1AD",
  "#EDD9A6",
  "#BBE8C3",
  "#A8EBDC",
  "#B1E2FF",
  "#E1D1FF",
  "#F6CBF1",
] as const;

export const spacing = {
  tiny: 2,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 24,
  section: 28,
  huge: 32,
  buttonHorizontal: 22,
  buttonHorizontalCompact: 18,
  buttonIconGap: 6,
  chipVertical: 4,
  chipStart: 8,
  chipEnd: 11,
  cardBottom: 6,
  listRowVertical: 11,
  emptyStateTop: 24,
  emptyStateHorizontal: 20,
  emptyStateBottom: 22,
  emptyStateGap: 10,
  compactCardVertical: 14,
  compactTimeBottom: 7,
  compactNamesTop: 10,
  pillStripOverlap: -7,
  onboardingTextGap: 14,
  stepIndicatorGap: 6,
  pageEmptyTop: 28,
  navigationButtonHorizontal: 6,
  sheetTop: 8,
  sheetFooterTop: 12,
  fieldVertical: 10,
  dialogPadding: 24,
  fieldTop: 10,
  fieldBottom: 8,
  inputVertical: 4,
  previewTop: 20,
  previewBottom: 14,
  swatchRingGap: 3,
  colorPanelPadding: 14,
  previewRowVertical: 10,
  previewRowHorizontal: 14,
  dayButtonGap: 6,
  customColorButtonTop: 12,
} as const;

export const radius = {
  segmentItem: 12,
  segment: 16,
  shapeOption: 18,
  previewRow: 18,
  colorPanel: 20,
  group: 22,
  card: 24,
  largeCard: 26,
  illustration: 40,
  round: 999,
} as const;

export const borderWidth = {
  thin: 1,
  regular: 1.5,
  selected: 2,
  thick: 3,
} as const;

export const sizes = {
  touchTarget: 44,
  iconSmall: 16,
  icon: 20,
  iconLarge: 24,
  tabIcon: 22,
  tabBadge: 18,
  pillStackCount: 24,
  pillInList: 28,
  pillInRow: 36,
  pillInPicker: 32,
  pillInStrip: 30,
  iconBadge: 36,
  listRowMinimumHeight: 56,
  tabBarMinimumHeight: 64,
  buttonMinimumHeight: 52,
  headerDecorationWidth: 390,
  headerDecorationHeight: 250,
  emptyIllustrationWidth: 160,
  emptyIllustrationHeight: 120,
  onboardingIllustrationHeight: 392,
  onboardingIllustrationArt: 320,
  pageEmptyIllustrationWidth: 220,
  pageEmptyIllustrationHeight: 186,
  stepIndicatorDot: 8,
  stepIndicatorCurrentDot: 24,
  pageEmptyTextMaxWidth: 300,
  grabberWidth: 40,
  grabberHeight: 5,
  navigationBarMinimumHeight: 52,
  stepperValueMinimumWidth: 40,
  chipValueMinimumHeight: 48,
  dialogMaximumWidth: 340,
  dialogIconBadge: 72,
  dialogIcon: 40,
  inputMinimumHeight: 32,
  pillPreview: 96,
  pillPreviewButton: 128,
  pillPreviewLarge: 112,
  pillShapeOption: 40,
  colorDot: 24,
  sliderThumb: 36,
  halfOptionMinimumHeight: 48,
  shapeOptionMinimumHeight: 84,
  dayButton: 44,
  medTextMinimumWidth: 120,
  settingsLabelMinimumWidth: 120,
  unconstrainedMeasureWidth: 10000,
  colorWheelCenter: 18,
} as const;

export const fontFamily = {
  regular: "AtkinsonHyperlegibleNext_400Regular",
  semiBold: "AtkinsonHyperlegibleNext_600SemiBold",
  bold: "AtkinsonHyperlegibleNext_700Bold",
  display: "YoungSerif_400Regular",
} as const;

export const fontSize = {
  tabLabel: 11.5,
  help: 14,
  small: 15,
  buttonSmall: 16,
  callout: 16,
  body: 17,
  lead: 18,
  heading: 21,
  mediumHeading: 26,
  compactTime: 24,
  time: 30,
  largeHeading: 30,
  title: 34,
} as const;

export const lineHeight = {
  lead: 26,
  callout: 22,
} as const;

export const onboardingIllustrationScreenRatio = 0.4;

export const pressedScale = 0.96;

export const pillStackOverlapRatio = 0.5;

export const duration = {
  short: 200,
  medium: 320,
  long: 480,
  twinkle: 1600,
  float: 2400,
} as const;

export const disabledOpacity = 0.5;

export const pressedOpacity = 0.6;

export const maximumFontScale = {
  tabLabel: 1.5,
} as const;

export const shadow = {
  raised: {
    shadowColor: colors.ink,
    shadowOpacity: 0.14,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  floating: {
    shadowColor: colors.ink,
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
} as const;
