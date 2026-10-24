# Architecture

## Dossiers

```
.env / .env.dist        // variables locales (ex. APPLE_TEAM_ID, EXPO_PUBLIC_DEBUG_MODE : seed + onboarding sauté au 1er lancement, pour l'e2e), .env non versionné
app.config.ts           // config Expo, lit .env
assets/icon/icon.svg    // source de l'icône de l'app
e2e/                    // tests end to end Maestro (YAML)
src/
  app/                  // routes Expo Router uniquement
  config/               // configuration TypeScript de l'app
  design-system/
    tokens.ts           // couleurs, espacements, rayons, tailles, polices
    fonts.ts            // chargement des polices
    components/<Name>/  // composants génériques
    components/Illustration/  // pièces d'illustration SVG (pilules, traits)
    hooks/              // hooks génériques (ex. useReduceMotion, useAccessibilityFocusOnMount)
    utils/              // fonctions génériques (ex. playPressHaptic)
  domain/               // types métier et fonctions pures partagées (Med, Intake, compareMeds…)
  features/<feature>/   // une feature = un domaine fonctionnel, pas un écran
    <Feature>Screen.tsx       // points d'entrée à la racine
    <Feature>Screen.spec.tsx  // test à côté du fichier testé
    components/         // composants internes
    hooks/              // hooks React (ex. use<Feature>Data.ts)
    queries/            // requêtes SQLite
    store/              // store Zustand persisté (petits réglages d'UI uniquement)
    utils/              // fonctions pures (formatters.ts, sorters.ts…)
  shared/               // transverse : navigation, intégrations tierces…
    database/           // SQLite : schéma, migrations, seed (voir docs/database.md)
    error-handling/     // écran d'erreur générique, ErrorBoundary global
    i18n/               // i18next : instance, traductions (locales/<langue>/<namespace>.json), formatage dates/heures
    storage/            // stockage sync (kv-store) partagé par les stores Zustand persistés
```

## Règles

| Dossier          | Peut importer                                                 | Ne doit pas importer   |
| ---------------- | ------------------------------------------------------------- | ---------------------- |
| `app/`           | `features/`, `shared/`, `design-system/`                      | —                      |
| `features/`      | `design-system/`, `domain/`, `shared/`, une autre feature (*) | `app/`                 |
| `shared/`        | `design-system/`, `domain/`                                   | `features/`            |
| `design-system/` | `domain/` (types seulement)                                   | `features/`, `shared/` |
| `domain/`        | rien (types et fonctions pures)                               | tout le reste          |

(*) Quand c'est raisonnable (ex. réutiliser un composant ou une requête du pilulier).

- **`app/`** : aucun écran écrit ici. Une route réexporte l'écran de la feature :
  `export { PillboxScreen as default } from "@/features/pillbox/PillboxScreen";`
- **`design-system/`** : générique, sans logique métier, sans texte en dur.
- **`domain/`** : types métier et fonctions pures utilisées par plusieurs features (ex. `formatIntakeTime`, `sortIntakeMeds`), testées à côté (`intake.spec.ts`).
- **`features/`** : logique et écrans d'un domaine. Un composant utilisé par une seule feature reste dans la feature.
- **Navigation** : barre d'onglets sur mesure. `design-system/components/TabBar` (visuel) + `shared/navigation/NavigationTabBar` (branchement Expo Router).

## Données

Détails : [`docs/database.md`](database.md).

- Les requêtes vivent dans la feature qui possède la donnée (ex. les prises appartiennent au pilulier : `features/pillbox/queries/getAllIntakes.ts`).
- La base est passée en paramètre des requêtes (`getAllIntakes(database)`) : testable avec une base en mémoire.
- Un écran lit ses données via un hook de la feature (`hooks/usePillboxData.ts`) : lecture synchrone, relue quand l'onglet reprend le focus (`useFocusEffect`).
- Tri en SQL (`ORDER BY`) quand il est simple. Tri alphanumérique (« 50 mg » avant « 100 mg ») dans une fonction pure (`utils/sorters.ts`), appelée par le hook.
- Données persistées : SQLite uniquement, jamais dans un state global.
- Calculs qui dépendent de l'heure (ex. prise en retard) : fonctions pures dans `utils/`, avec `now: Date` en paramètre (testées avec une heure fixée).
- Hors écran (ex. point sur l'onglet « Aujourd'hui ») : relecture à chaque écriture en base via `subscribeToDatabaseChanges` (`shared/database/database.ts`).
- Rafraîchissement à la minute : `features/today/hooks/useCurrentMinute.ts` (minute suivante + retour au premier plan). Les états sont recalculés en mémoire (`useMemo`), sans relire la base.

## Conventions de fichiers

- Dossiers en kebab-case quand le nom a plusieurs mots (ex. `shared/error-handling/`).
- Racine d'une feature (ou d'un module de `shared/`) : uniquement les points d'entrée (écrans `*Screen.tsx`, cœur du module).
- Le reste est rangé par type, même pour un seul fichier : `components/`, `hooks/`, `queries/`, `utils/`.

- Un composant par fichier : `<Name>.tsx` + `<Name>.styles.ts` (`StyleSheet.create`).
- Logique et rendu séparés : formatage dans `utils/formatters.ts`, tri dans `utils/sorters.ts` (fonctions pures testées).
- Tests unitaires au même niveau que le fichier testé, suffixe `.spec.ts(x)` (ex. `src/features/pillbox/PillboxScreen.spec.tsx`).
- Imports absolus via `@/` (ex. `@/design-system/tokens`), relatifs dans un même dossier.
- Aucune valeur en dur dans les styles : toujours un token (`tokens.ts`).
- Polices : une famille par graisse (`fontFamily.regular`, `semiBold`, `bold`, `display`), pas de `fontWeight`.
- Textes : toujours via le composant `Text` du design system (`variant` + `tone`).

## Traductions (i18n)

Stack : i18next + react-i18next, extraction avec `i18next-cli` (`i18next.config.ts`). Français et anglais.

- **Clé = texte français** : `t("Valider la prise")`. Pas de séparateurs (`.` et `:` autorisés dans le texte).
- **Un namespace par feature** : `today`, `pillbox`, `stocks`, `settings`, `onboarding`, `notifications`, et `common` (navigation, écrans d'erreur, textes partagés).
- **Fichiers** : `src/shared/i18n/locales/<fr|en>/<namespace>.json`. En FR la valeur est la clé (générée), sauf les pluriels.
- **Clés typées** : une clé inconnue est une erreur TypeScript (`src/shared/i18n/i18next.d.ts`).

### Ajouter un texte

1. Dans un composant : `const { t } = useTranslation("<namespace>")`, puis `t("Mon texte")`.
2. `make i18n-extract` : ajoute la clé dans les fichiers FR et EN.
3. Écrire la traduction dans `locales/en/<namespace>.json`.
4. `make tests` échoue si une traduction EN manque ou si une clé n'est plus utilisée.

### Règles

- **Texte hors composant** (constante de module, `formatters.ts`) : une fonction qui reçoit `t` en paramètre, typé `TFunction<"<namespace>">` **écrit tel quel** (pas d'alias de type, pas de record de fonctions) pour que l'extraction trouve le namespace. Ex. `formatDuration(t: TFunction<"today">, minutes)`.
- **Code hors React** (notifications) : `i18n.t("…", { ns: "notifications" })`.
- **Pluriels** : `t("{{count}} jours", { count })`, puis écrire le singulier dans `<clé>_one` (FR et EN). Ne pas nommer `count` une variable qui n'est pas un pluriel.
- **Dates** : `shared/i18n/formatters.ts` (`Intl.DateTimeFormat`), langue en paramètre via `useLanguage()`.
- **Heure** : `formatIntakeTime` (`shared/i18n/formatters.ts`) suit le réglage iOS 12 h / 24 h, quelle que soit la langue.
- **Langue** : `useAppLanguage()` (réglages) → `useI18nLanguageSync()` dans `app/_layout.tsx`. Langue initiale fixée avant le premier rendu (pas de flash).
- **Tests** : Jest tourne en FR. `renderInEnglish()` (`shared/i18n/testHelpers.ts`) ou `i18n.changeLanguage("en")` pour un test EN, la langue revient en FR après chaque test.

## Accessibilité

- Éléments interactifs : `accessibilityRole`, `accessibilityLabel`, `accessibilityState`.
- Titres : `accessibilityRole="header"`.
- Cibles tactiles ≥ 44 pt (`sizes.touchTarget`).
- Dynamic Type : pas de hauteur fixe sur un conteneur de texte (`minHeight`). Plafond (`maximumFontScale`) seulement si indispensable (libellés d'onglets).
- Contraste AA vérifié pour toutes les paires de couleurs des tokens.
- Petits écrans et Dynamic Type : quand une ligne ne tient pas, changer de disposition avec `useFitsInWidth` (mesure `onLayout`) plutôt que tasser ou déformer les éléments.

## Icône de l'app

Source : `assets/icon/icon.svg`. Pour régénérer le PNG (1024×1024, sans transparence) :

```bash
qlmanage -t -s 1024 -o /tmp assets/icon/icon.svg
magick /tmp/icon.svg.png -background "#EFEAFC" -alpha remove -alpha off assets/images/icon.png
```

Puis `npx expo prebuild --clean`.
