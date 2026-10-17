# Architecture

## Dossiers

```
.env / .env.dist        // variables locales (ex. APPLE_TEAM_ID, EXPO_PUBLIC_DEBUG_MODE), .env non versionné
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
    hooks/              // hooks génériques (ex. useReduceMotion)
    utils/              // fonctions génériques (ex. playPressHaptic)
  domain/               // types métier et fonctions pures partagées (Med, Intake, compareMeds…)
  features/<feature>/   // une feature = un domaine fonctionnel, pas un écran
    <Feature>Screen.tsx       // points d'entrée à la racine
    <Feature>Screen.spec.tsx  // test à côté du fichier testé
    components/         // composants internes
    hooks/              // hooks React (ex. use<Feature>Data.ts)
    queries/            // requêtes SQLite
    utils/              // fonctions pures (formatters.ts, sorters.ts…)
  shared/               // transverse : navigation, intégrations tierces…
    database/           // SQLite : schéma, migrations, seed (voir docs/database.md)
    error-handling/     // écran d'erreur générique, ErrorBoundary global
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

## Accessibilité

- Éléments interactifs : `accessibilityRole`, `accessibilityLabel`, `accessibilityState`.
- Titres : `accessibilityRole="header"`.
- Cibles tactiles ≥ 44 pt (`sizes.touchTarget`).
- Dynamic Type : pas de hauteur fixe sur un conteneur de texte (`minHeight`). Plafond (`maximumFontScale`) seulement si indispensable (libellés d'onglets).
- Contraste AA vérifié pour toutes les paires de couleurs des tokens.

## Icône de l'app

Source : `assets/icon/icon.svg`. Pour régénérer le PNG (1024×1024, sans transparence) :

```bash
qlmanage -t -s 1024 -o /tmp assets/icon/icon.svg
magick /tmp/icon.svg.png -background "#EFEAFC" -alpha remove -alpha off assets/images/icon.png
```

Puis `npx expo prebuild --clean`.
