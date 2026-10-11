# Spec 03 — Première partie du design system

## Contexte

Implémenter une première partie du design Claude Design (projet « Pilbo ») : icône de l'app, barre d'onglets, écran « Pilulier · Liste des prises » avec des fixtures statiques.

> Chaque case doit être vérifiée et validée par toi avant de passer à la suivante : je m'arrête après chaque étape et j'attends ton feu vert.

> Revue de la spec terminée : toutes les questions ont été tranchées (voir ci-dessous). Spec terminée et validée.

## Décisions validées

- **Onglets** : barre d'onglets **sur mesure** (icônes SVG du design), pas de `NativeTabs`.
- **Textes** : en dur (en français, comme le design). i18n plus tard (CLAUDE.md corrigé).
- **« Hors planning »** : inclus, textes en dur, sans logique.
- **Bouton « + » et tap sur les cartes** : visibles et accessibles, sans action.
- **Polices** : Atkinson Hyperlegible Next (texte) + Young Serif (titres), via `expo-font`.
- **Thème** : clair forcé (`userInterfaceStyle: "light"`), couleurs en tokens.
- **Icône** : « Tas D, gros plan », fond lavande (toujours lavande quand le design propose ce tweak).
- **`.env`** : dans cette spec (`app.json` → `app.config.ts`).
- **ESLint / Prettier / Jest** : spec dédiée, hors scope ici.
- **Onglet par défaut** : Pilulier.
- **PoC notifications** : l'écran est supprimé, la logique est gardée dans `features/notifications`. Plus de rappels planifiés au lancement.

## Architecture validée

```
.env / .env.dist
app.config.ts
src/
  app/                 // routes only, re-export feature screens
  config/
  design-system/
    tokens.ts
    components/<Name>/<Name>.tsx + <Name>.styles.ts
  domain/              // business types shared by features (Med, Intake…)
  features/<feature>/
    <Feature>Screen.tsx + .styles.ts
    components/
    fixtures.ts        // when needed
  shared/
```

## Types validés (`src/domain/`)

```ts
type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
type PillSize = "small" | "medium" | "large";

type PillDesign =
  | { shape: "round"; color: string; hasScoreLine: boolean; size: PillSize }
  | { shape: "oval"; color: string; size: PillSize }
  | { shape: "capsule"; firstHalfColor: string; secondHalfColor: string; size: PillSize };

interface Med {
  id: string;
  name: string;
  strength: string; // free text, ex. "50 mg"
  design: PillDesign;
}

interface MedQuantity {
  med: Med;
  quantity: number;
}

interface Intake {
  id: string;
  time: { hour: number; minute: number };
  days: Weekday[];
  reminderIntervalMinutes: number;
  medQuantities: MedQuantity[];
}
```

## Sources du design (Claude Design)

- Canvas : https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4
- À lire avec l'outil Artifact (`action: "read"`, `path`), pas avec WebFetch :
  - `project/pilulier.dc.html` → écran « Pilulier · Liste des prises » (+ SVG des pilules et des icônes d'onglets).
  - `project/icon-pile-d.dc.html` → icône « Tas D, gros plan » (thème `lavande`, fond `#EFEAFC`).
  - `project/pilbo.css` → styles partagés (source des tokens).
  - `project/components.dc.html` → composants, si besoin.
- Le design contient d'autres données (Metformine, Mélatonine, 08:30…) : ce sont **nos fixtures** qui font foi.

## Fixtures (validées)

Toutes les prises : tous les jours, rappel toutes les 10 min.

| Médicament        | Design                                   | Couleurs (design)               |
| ----------------- | ---------------------------------------- | ------------------------------- |
| Lithium 250 mg    | `round`, `hasScoreLine: true`, `medium`  | lavande `#D6C9F5`               |
| Lamictal 50 mg    | `capsule`, `small`                       | turquoise `#B3E8E0` (2 moitiés) |
| Lamictal 100 mg   | `capsule`, `large`                       | turquoise `#B3E8E0` (2 moitiés) |
| Quviviq 50 mg     | `oval`, `medium`                         | rose `#F8C6DA`                  |
| Prégabaline 50 mg | `round`, `hasScoreLine: false`, `medium` | jaune `#FBE29A`                 |

- 08:20 : 1× Lithium 250 mg + 1× Lamictal 50 mg
- 12:20 : 1× Lithium 250 mg
- 20:20 : 2× Lithium 250 mg
- 22:00 : 1× Lamictal 100 mg + 1× Quviviq 50 mg + 1× Prégabaline 50 mg

« Hors planning » (en dur, sans logique) : Hydroxyzine 25 mg, `capsule` `medium` rose `#F58FB8` / blanc `#FFFFFF`, sous-titre « Si besoin », aide « À prendre si besoin, depuis l'accueil. », ligne « Ajouter un médicament ».

---

## Étape 0 — Plan

- [x] Copier le plan dans `./plans/03_first_part_of_design_system.md`.

## Étape 1 — Architecture

- [x] Valider ensemble l'architecture (voir ci-dessus), fait pendant la revue de la spec.

## Étape 2 — Réorganiser l'existant

- [x] Créer les dossiers `config/`, `design-system/`, `domain/`, `features/`, `shared/`.
- [x] Déplacer `src/notifications.ts` → `src/features/notifications/notifications.ts` (mettre à jour `docs/notifications.md`).
- [x] Supprimer l'écran PoC `src/app/index.tsx`.
- [x] `app.json` → `app.config.ts`, avec `APPLE_TEAM_ID` lu depuis `.env`.
- [x] Créer `.env` et `.env.dist`, ajouter `.env` au `.gitignore`.
- [x] `userInterfaceStyle: "light"`.
- [x] `npx tsc --noEmit` passe.

## Étape 3 — Icône de l'app

- [x] Recréer l'icône « Tas D, gros plan » (lavande) en SVG à partir du design.
- [x] L'exporter en PNG 1024×1024 et la brancher comme icône iOS (remplace `assets/expo.icon`).
- [x] Build sur l'iPhone, tu vérifies l'icône sur l'écran d'accueil.

## Étape 4 — Fondations du design system

- [x] Installer `react-native-svg`.
- [x] Ajouter les polices (Atkinson Hyperlegible Next 400/600/700, Young Serif) via `expo-font`.
- [x] `design-system/tokens.ts` : couleurs, espacements, rayons, tailles et graisses de police (repris de `pilbo.css` du design), contraste AA vérifié.
- [x] Textes compatibles Dynamic Type.

## Étape 5 — Barre d'onglets

- [x] Composant `TabBar` sur mesure (4 onglets : Aujourd'hui, Pilulier, Stock, Réglages, icônes SVG du design).
- [x] Accessibilité : `accessibilityRole="tab"`, `accessibilityState.selected`, labels, cibles ≥ 44pt, Dynamic Type.
- [x] Pilulier sélectionné au lancement.
- [x] Tu vérifies sur l'iPhone (+ VoiceOver). VoiceOver non testé (pas de build device), à revérifier.

## Étape 6 — Écrans vides des onglets

- [x] Un écran par onglet dans sa feature (`today`, `pillbox`, `stocks`, `settings`), avec seulement le titre.
- [x] Routes dans `src/app/(tabs)/` qui réexportent les écrans. Pas de header de navigation.
- [x] Tu vérifies sur l'iPhone.

## Étape 7 — Écran Pilulier (statique, comme le design)

- [x] Composant `Pill` (design-system) qui dessine un `PillDesign` (rond, ovale, gélule bicolore, 3 tailles).
- [x] En-tête : titre « Pilulier » + bouton « + » (sans action, `accessibilityLabel` « Nouvelle prise »).
- [x] `IntakeCard` : heure, jours + intervalle, liste des médicaments (pilule, nom, dosage, quantité), chevron. Carte accessible comme un bouton (sans action).
- [x] `IntakeList`.
- [x] Section « Hors planning » (textes en dur, sans action).
- [x] Défilement, Dynamic Type sans casse, VoiceOver. VoiceOver non testé, à revérifier.
- [x] Chaque composant dans son propre fichier (+ `.styles.ts`).
- [x] Tu vérifies sur l'iPhone.

## Étape 8 — Fixtures

- [x] Types dans `src/domain/`.
- [x] `features/pillbox/fixtures.ts` typé (médicaments + prises ci-dessus).
- [x] L'écran Pilulier affiche les fixtures (formatage de l'heure et des jours).
- [x] `npx tsc --noEmit` passe.
- [x] Tu vérifies sur l'iPhone.

## Étape 9 — Documentation

- [x] Écrire `docs/architecture.md` (dossiers, règles, conventions de fichiers).
- [x] Proposer le lien à ajouter dans `CLAUDE.md` (après ta validation).
