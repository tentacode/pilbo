// App Store screenshots configuration, read by template.html (browser) and render.mjs (Node).
// Screenshots go in screenshots/<lang>/<screenshot>, rendered images in output/<lang>/.
globalThis.storeScreenshots = {
  canvas: { width: 1320, height: 2868 },
  languages: ["fr", "en"],
  slides: [
    {
      id: "today",
      screenshot: "01-today.png",
      layout: "text-top",
      background: "lavender",
      headline: {
        fr: "Vos prises du jour,\nd’un coup d’œil",
        en: "Today’s intakes,\nat a glance",
      },
      subtitle: {
        fr: "Validez chaque prise d’un geste.",
        en: "Check off each intake in one tap.",
      },
      pills: [
        { shape: "round", color: "butter", x: 1240, y: 1080, size: 310, rotate: 0 },
        { shape: "capsule", color: "turquoise", x: 85, y: 1850, size: 400, rotate: -25 },
      ],
    },
    {
      id: "reminders",
      screenshot: "02-reminders.png",
      layout: "text-top",
      background: "rose",
      headline: {
        fr: "Des rappels qui\ninsistent, gentiment",
        en: "Reminders that\ngently insist",
      },
      subtitle: {
        fr: "Un bip toutes les 10 min, jusqu’à la prise.",
        en: "A beep every 10 minutes, until you take it.",
      },
      pills: [
        { shape: "bicolor", color: "roseStrong", x: 95, y: 1180, size: 400, rotate: 35 },
        { shape: "round", color: "lavender", x: 1245, y: 2050, size: 300, rotate: 20 },
      ],
    },
    {
      id: "pills",
      screenshot: "03-pills.png",
      layout: "text-bottom",
      background: "butter",
      headline: {
        fr: "Des pilules\nà votre image",
        en: "Pills that\nlook like yours",
      },
      subtitle: {
        fr: "Formes et couleurs : repérez chaque médicament.",
        en: "Shapes and colors to spot each medication.",
      },
      pills: [
        { shape: "capsule", color: "lavender", x: 1225, y: 520, size: 390, rotate: 30 },
        { shape: "round", color: "turquoise", x: 95, y: 1500, size: 300, rotate: 0 },
      ],
    },
    {
      id: "stocks",
      screenshot: "04-stocks.png",
      layout: "text-top",
      background: "turquoise",
      headline: {
        fr: "Ne tombez plus\nà court",
        en: "Never run out\nagain",
      },
      subtitle: {
        fr: "Pilbo vous prévient avant la fin de la boîte.",
        en: "Pilbo tells you before the box runs out.",
      },
      pills: [
        { shape: "round", color: "white", x: 80, y: 1200, size: 280, rotate: 0 },
        { shape: "bicolor", color: "skyBlue", x: 1235, y: 1950, size: 420, rotate: -30 },
      ],
    },
    {
      id: "calendar",
      screenshot: "05-calendar.png",
      layout: "text-bottom",
      background: "lavender",
      headline: {
        fr: "Votre suivi,\njour après jour",
        en: "Your history,\nday by day",
      },
      subtitle: {
        fr: "Retrouvez ce que vous avez pris, ou non.",
        en: "See what you took, and what you skipped.",
      },
      pills: [
        { shape: "round", color: "rose", x: 85, y: 640, size: 300, rotate: 0 },
        { shape: "capsule", color: "butter", x: 1235, y: 1650, size: 390, rotate: -20 },
      ],
    },
    {
      id: "privacy",
      screenshot: "06-privacy.png",
      layout: "text-top",
      background: "night",
      headline: {
        fr: "100 % local,\nsans compte",
        en: "100% local,\nno account",
      },
      subtitle: {
        fr: "Vos données restent sur votre téléphone.",
        en: "Your data stays on your phone.",
      },
      pills: [
        { shape: "capsule", color: "rose", x: 1230, y: 1150, size: 390, rotate: 25 },
        { shape: "round", color: "turquoise", x: 90, y: 2000, size: 310, rotate: 0 },
      ],
    },
  ],
};
