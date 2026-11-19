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
        fr: "Validez une prise en un geste.",
        en: "Check off an intake in one tap.",
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
        fr: "Des rappels discrets\net efficaces",
        en: "Discreet, effective\nreminders",
      },
      subtitle: {
        fr: "Une notification toutes les 10 minutes, jusqu’à la prise.",
        en: "A notification every 10 minutes, until you take it.",
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
        fr: "Des médicaments\nfaciles à reconnaître",
        en: "Medications that are\neasy to recognize",
      },
      subtitle: {
        fr: "Choisissez leur forme, leur taille et leurs couleurs.",
        en: "Choose their shape, size and colors.",
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
        fr: "Fini les\nboîtes vides",
        en: "No more\nempty boxes",
      },
      subtitle: {
        fr: "Une notification vous prévient avant d’en manquer.",
        en: "A notification lets you know before you run out.",
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
        fr: "L’historique\nde vos prises",
        en: "The history\nof your intakes",
      },
      subtitle: {
        fr: "Les prises faites, en retard ou oubliées.",
        en: "Taken, late or forgotten intakes.",
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
        fr: "Vos données restent\nsur votre téléphone",
        en: "Your data stays\non your phone",
      },
      subtitle: {
        fr: "Sans compte, sans serveur, sans publicité.",
        en: "No account, no server, no ads.",
      },
      pills: [
        { shape: "capsule", color: "rose", x: 1230, y: 1150, size: 390, rotate: 25 },
        { shape: "round", color: "turquoise", x: 90, y: 2000, size: 310, rotate: 0 },
      ],
    },
  ],
};
