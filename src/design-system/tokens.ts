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
  onInk: "#FFFFFF",
  alertBackground: "#FFE0DA",
  alertLine: "#FFCBC2",
  alertChip: "#FFCBC2",
  alertInk: "#8A2A1A",
  pillHighlight: "#FFFFFF",
} as const;

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
} as const;

export const radius = {
  group: 22,
  card: 24,
  largeCard: 26,
  round: 999,
} as const;

export const borderWidth = {
  thin: 1,
  regular: 1.5,
} as const;

export const sizes = {
  touchTarget: 44,
  iconSmall: 16,
  icon: 20,
  iconLarge: 24,
  tabIcon: 22,
  pillInList: 28,
  pillInRow: 36,
  iconBadge: 36,
  listRowMinimumHeight: 56,
  tabBarMinimumHeight: 64,
  buttonMinimumHeight: 52,
  headerDecorationWidth: 390,
  headerDecorationHeight: 250,
  emptyIllustrationWidth: 160,
  emptyIllustrationHeight: 120,
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
  body: 17,
  heading: 21,
  time: 30,
  title: 34,
} as const;

export const pressedScale = 0.96;

export const maximumFontScale = {
  tabLabel: 1.5,
} as const;

export const shadow = {
  floating: {
    shadowColor: colors.ink,
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
} as const;
