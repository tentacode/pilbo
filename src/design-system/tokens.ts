export const colors = {
  ink: "#2E2A5C",
  inkPressed: "#211E46",
  inkSecondary: "#5C5780",
  background: "#FDFCFF",
  surface: "#FFFFFF",
  line: "#E9E4F5",
  fill: "#F3F0FA",
  separator: "#E4DFF0",
  accentSoft: "#EFEAFC",
  onInk: "#FFFFFF",
  pillHighlight: "#FFFFFF",
} as const;

export const spacing = {
  tiny: 2,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 24,
  huge: 32,
  buttonHorizontal: 22,
} as const;

export const radius = {
  group: 22,
  card: 24,
  round: 999,
} as const;

export const borderWidth = {
  thin: 1,
  regular: 1.5,
} as const;

export const sizes = {
  touchTarget: 44,
  icon: 20,
  iconLarge: 24,
  tabIcon: 22,
  pillInList: 28,
  pillInRow: 36,
  iconBadge: 36,
  listRowMinimumHeight: 56,
  tabBarMinimumHeight: 64,
  buttonMinimumHeight: 52,
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
