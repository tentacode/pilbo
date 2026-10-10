# Spec 03 — Première partie du design system

## Contexte

Implémenter une première partie du design Claude Design (projet « Pilbo ») : icône de l'app, barre d'onglets, écran « Pilulier · Liste des prises » avec des fixtures statiques.

> Chaque case doit être vérifiée et validée par toi avant de passer à la suivante : je m'arrête après chaque étape et j'attends ton feu vert.

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
type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type PillSize = 'small' | 'medium' | 'large';

type PillDesign =
  | { shape: 'round'; color: string; hasScoreLine: boolean; size: PillSize }
  | { shape: 'oval'; color: string; size: PillSize }
  | { shape: 'capsule'; firstHalfColor: string; secondHalfColor: string; size: PillSize };

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

## Fixtures

Toutes les prises : tous les jours, rappel toutes les 10 min.

| Médicament | Design (couleurs du design) |
|---|---|
| Lithium 250 mg | rond lavande, barre de sécabilité, medium |
| Lamictal 50 mg | gélule turquoise, small |
| Lamictal 100 mg | gélule turquoise, large |
| Quviviq 50 mg | ovale rose, medium |
| Prégabaline 50 mg | rond jaune, sans barre, medium |

- 08:20 : 1× Lithium 250 mg + 1× Lamictal 50 mg
- 12:20 : 1× Lithium 250 mg
- 20:20 : 2× Lithium 250 mg
- 22:00 : 1× Lamictal 100 mg + 1× Quviviq 50 mg + 1× Prégabaline 50 mg

« Hors planning » (en dur) : Hydroxyzine 25 mg, gélule rose/blanche, « Si besoin ».

---

## Étape 0 — Plan
- [x] Copier le plan dans `./plans/03_first_part_of_design_system.md`.

## Étape 1 — Architecture
- [x] Valider ensemble l'architecture (voir ci-dessus), fait pendant la revue de la spec.

## Étape 2 — Réorganiser l'existant
- [ ] Créer les dossiers `config/`, `design-system/`, `domain/`, `features/`, `shared/`.
- [ ] Déplacer `src/notifications.ts` → `src/features/notifications/notifications.ts` (mettre à jour `docs/notifications.md`).
- [ ] Supprimer l'écran PoC `src/app/index.tsx`.
- [ ] `app.json` → `app.config.ts`, avec `APPLE_TEAM_ID` lu depuis `.env`.
- [ ] Créer `.env` et `.env.dist`, ajouter `.env` au `.gitignore`.
- [ ] `userInterfaceStyle: "light"`.
- [ ] `npx tsc --noEmit` passe.

## Étape 3 — Icône de l'app
- [ ] Recréer l'icône « Tas D, gros plan » (lavande) en SVG à partir du design.
- [ ] L'exporter en PNG 1024×1024 et la brancher comme icône iOS (remplace `assets/expo.icon`).
- [ ] Build sur l'iPhone, tu vérifies l'icône sur l'écran d'accueil.

## Étape 4 — Fondations du design system
- [ ] Installer `react-native-svg`.
- [ ] Ajouter les polices (Atkinson Hyperlegible Next 400/600/700, Young Serif) via `expo-font`.
- [ ] `design-system/tokens.ts` : couleurs, espacements, rayons, tailles et graisses de police (repris de `pilbo.css` du design), contraste AA vérifié.
- [ ] Textes compatibles Dynamic Type.

## Étape 5 — Barre d'onglets
- [ ] Composant `TabBar` sur mesure (4 onglets : Aujourd'hui, Pilulier, Stock, Réglages, icônes SVG du design).
- [ ] Accessibilité : `accessibilityRole="tab"`, `accessibilityState.selected`, labels, cibles ≥ 44pt, Dynamic Type.
- [ ] Pilulier sélectionné au lancement.
- [ ] Tu vérifies sur l'iPhone (+ VoiceOver).

## Étape 6 — Écrans vides des onglets
- [ ] Un écran par onglet dans sa feature (`today`, `pillbox`, `stocks`, `settings`), avec seulement le titre.
- [ ] Routes dans `src/app/(tabs)/` qui réexportent les écrans. Pas de header de navigation.
- [ ] Tu vérifies sur l'iPhone.

## Étape 7 — Écran Pilulier (statique, comme le design)
- [ ] Composant `Pill` (design-system) qui dessine un `PillDesign` (rond, ovale, gélule bicolore, 3 tailles).
- [ ] En-tête : titre « Pilulier » + bouton « + » (sans action, `accessibilityLabel` « Nouvelle prise »).
- [ ] `IntakeCard` : heure, jours + intervalle, liste des médicaments (pilule, nom, dosage, quantité), chevron. Carte accessible comme un bouton (sans action).
- [ ] `IntakeList`.
- [ ] Section « Hors planning » (textes en dur, sans action).
- [ ] Défilement, Dynamic Type sans casse, VoiceOver.
- [ ] Chaque composant dans son propre fichier (+ `.styles.ts`).
- [ ] Tu vérifies sur l'iPhone.

## Étape 8 — Fixtures
- [ ] Types dans `src/domain/`.
- [ ] `features/pillbox/fixtures.ts` typé (médicaments + prises ci-dessus).
- [ ] L'écran Pilulier affiche les fixtures (formatage de l'heure et des jours).
- [ ] `npx tsc --noEmit` passe.
- [ ] Tu vérifies sur l'iPhone.

## Étape 9 — Documentation
- [ ] Écrire `docs/architecture.md` (dossiers, règles, conventions de fichiers).
- [ ] Proposer le lien à ajouter dans `CLAUDE.md` (après ta validation).
