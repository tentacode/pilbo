# Architecture

## Dossiers

```
.env / .env.dist        // variables locales (ex. APPLE_TEAM_ID), .env non versionné
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
  domain/               // types métier partagés (Med, Intake…)
  features/<feature>/   // une feature = un domaine fonctionnel, pas un écran
    <Feature>Screen.tsx
    <Feature>Screen.spec.tsx  // test à côté du fichier testé
    components/
    fixtures.ts         // si besoin
    formatters.ts       // si besoin
  shared/               // transverse : navigation, intégrations tierces…
```

## Règles

| Dossier          | Peut importer                            | Ne doit pas importer   |
| ---------------- | ---------------------------------------- | ---------------------- |
| `app/`           | `features/`, `shared/`, `design-system/` | —                      |
| `features/`      | `design-system/`, `domain/`, `shared/`   | une autre feature      |
| `shared/`        | `design-system/`, `domain/`              | `features/`            |
| `design-system/` | `domain/` (types seulement)              | `features/`, `shared/` |
| `domain/`        | rien                                     | tout le reste          |

- **`app/`** : aucun écran écrit ici. Une route réexporte l'écran de la feature :
  `export { PillboxScreen as default } from "@/features/pillbox/PillboxScreen";`
- **`design-system/`** : générique, sans logique métier, sans texte en dur.
- **`features/`** : logique et écrans d'un domaine. Un composant utilisé par une seule feature reste dans la feature.
- **Navigation** : barre d'onglets sur mesure. `design-system/components/TabBar` (visuel) + `shared/navigation/NavigationTabBar` (branchement Expo Router).

## Conventions de fichiers

- Un composant par fichier : `<Name>.tsx` + `<Name>.styles.ts` (`StyleSheet.create`).
- Logique et rendu séparés : formatage dans `formatters.ts`, données dans `fixtures.ts`.
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
