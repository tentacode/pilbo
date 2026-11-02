// LinkedIn post images configuration, read by template.html (browser) and render.mjs (Node).
// Screenshots are shared with the App Store images: ../screenshots/screenshots/<lang>/<screenshot>.
globalThis.linkedinVariants = {
  canvas: { width: 1200, height: 627, scale: 2 },
  language: "fr",
  variants: [
    {
      id: "testers",
      background: "lavender",
      eyebrow: "Bêta ouverte sur iPhone",
      headline: "Pilbo cherche\nses testeurs",
      subtitle: "Une app pour suivre vos médicaments. Gratuite, sans compte, 100 % locale.",
      phones: [{ screenshot: "01-today.png", x: 905, y: 330, height: 560, rotate: 6 }],
      pills: [
        { shape: "round", color: "butter", x: 1130, y: 120, size: 130, rotate: 0 },
        { shape: "capsule", color: "turquoise", x: 690, y: 520, size: 160, rotate: -25 },
        { shape: "bicolor", color: "roseStrong", x: 1140, y: 560, size: 150, rotate: 30 },
      ],
    },
    {
      id: "organized",
      background: "turquoise",
      eyebrow: "Testeurs recherchés",
      headline: "Vos traitements,\nenfin organisés",
      subtitle: "Prises, rappels, stocks et calendrier, dans une seule app iPhone.",
      phones: [
        { screenshot: "04-stocks.png", x: 770, y: 360, height: 470, rotate: -10 },
        { screenshot: "05-calendar.png", x: 1060, y: 360, height: 470, rotate: 10 },
        { screenshot: "01-today.png", x: 915, y: 330, height: 540, rotate: 0 },
      ],
      pills: [
        { shape: "round", color: "white", x: 650, y: 110, size: 110, rotate: 0 },
        { shape: "bicolor", color: "skyBlue", x: 1150, y: 90, size: 140, rotate: -30 },
      ],
    },
    {
      id: "many-pills",
      background: "night",
      eyebrow: "Bêta TestFlight",
      headline: "Beaucoup de\nmédicaments ?",
      subtitle: "Essayez Pilbo, et aidez-moi à l’améliorer.",
      phones: [{ screenshot: "06-privacy.png", x: 900, y: 335, height: 560, rotate: -6 }],
      pills: [
        { shape: "capsule", color: "rose", x: 1120, y: 140, size: 160, rotate: 25 },
        { shape: "round", color: "turquoise", x: 680, y: 130, size: 110, rotate: 0 },
        { shape: "round", color: "butter", x: 1130, y: 540, size: 120, rotate: 0 },
      ],
    },
    {
      id: "reminders",
      background: "butter",
      eyebrow: "App iPhone, en bêta",
      headline: "Ne ratez plus\nune prise",
      subtitle: "Des rappels qui insistent, gentiment, jusqu’à la prise.",
      phones: [{ screenshot: "01-today.png", x: 930, y: 560, height: 900, rotate: -14 }],
      pills: [
        { shape: "capsule", color: "lavender", x: 1130, y: 90, size: 160, rotate: 30 },
        { shape: "round", color: "turquoise", x: 680, y: 120, size: 110, rotate: 0 },
      ],
    },
    {
      id: "pills",
      background: "rose",
      eyebrow: "App iPhone, en bêta",
      headline: "Des pilules\nà votre image",
      subtitle: "Repérez chaque médicament à sa forme et à sa couleur.",
      phones: [
        { screenshot: "03-pills.png", x: 810, y: 350, height: 520, rotate: -4 },
        { screenshot: "02-reminders.png", x: 1050, y: 300, height: 520, rotate: 6 },
      ],
      pills: [
        { shape: "bicolor", color: "roseStrong", x: 660, y: 540, size: 150, rotate: 35 },
        { shape: "round", color: "lavender", x: 1150, y: 580, size: 120, rotate: 20 },
      ],
    },
  ],
};
