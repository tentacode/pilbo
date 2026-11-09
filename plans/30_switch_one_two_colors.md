# Spec 30 — Switch « Une couleur » / « Deux couleurs »

## Contexte

Choisir deux fois la même couleur dans l'écran Apparence est pénible, surtout avec une couleur perso au slider. On ajoute un switch « Une couleur » / « Deux couleurs » : en mode « Une couleur », les onglets « Couleur 1 » / « Couleur 2 » disparaissent et la couleur choisie colore les deux moitiés. Aucun changement en base. Spec et décisions : `specs/30_switch_one_two_colors.md`.

Fichiers concernés :

- `src/features/pillbox/AppearanceScreen.tsx` (écran partagé, `DraftAppearanceScreen`)
- `src/features/meds/MedAppearanceScreen.tsx` (apparence depuis la fiche médicament)
- `src/features/pillbox/components/ColorField.tsx` (+ `.styles.ts`), `SizeField.tsx` (modèle du switch)
- `src/features/pillbox/hooks/useColorEditing.ts`
- `src/features/pillbox/utils/pillDesign.ts` (+ `.spec.ts`), `utils/medDraft.ts` (+ `.spec.ts`)
- `src/design-system/components/SegmentedControl/SegmentedControl.tsx`

## Étape 1 — Fonctions pures

- Dans `utils/pillDesign.ts` :
  - [x] Type `ColorCount = 1 | 2`.
  - [x] `colorCountOf(design)` : `1` si les deux couleurs sont identiques, sinon `2`.
  - [x] `withSingleColor(design)` : la couleur 1 appliquée aux deux moitiés.
  - [x] `withColor` étendu (paramètre `colorCount`) pour appliquer une couleur aux deux moitiés en mode « Une couleur ».
  - [x] `randomPillDesign` inchangé.
- [x] Tests Jest dans `utils/pillDesign.spec.ts`.

## Étape 2 — Position initiale pour un brouillon

- [x] Fonction pure `initialColorCount(draft)` (dans `utils/medDraft.ts`) : `2` si le brouillon n'a pas de `medId` et que ses deux couleurs sont `pillSwatches.white`, sinon `colorCountOf(draft.design)`. Pas de nouveau champ dans `MedDraft`.
- [x] Tests dans `utils/medDraft.spec.ts` : nouveau blanc / blanc → `2` ; nouveau autre couleur identique → `1` ; existant blanc / blanc → `1` ; couleurs différentes → `2`.

## Étape 3 — État du mode dans `useColorEditing`

- `useColorEditing(design, onDesignChange, initialColorCount)` :
  - [x] État `colorCount`.
  - [x] `selectColorCount(count)` :
    - vers `1` : `withSingleColor`, onglet actif à `0`, couleur perso calée sur la couleur 1 (le panneau garde son état ouvert/fermé) ;
    - vers `2` : couleurs inchangées, onglet actif à `0`.
  - [x] En mode `1`, `selectSwatchColor` et `changeCustomColor` colorent les deux moitiés.
  - [x] `syncColorCount(design)` appelé après l'aléatoire : `colorCountOf(randomDesign)`, onglet actif à `0`.

## Étape 4 — Interface

- [x] Nouveau composant `components/ColorCountField.tsx` : `SegmentedControl` « Une couleur » / « Deux couleurs », `accessibilityLabel` « Nombre de couleurs ». Même apparence que `SizeField`, sans `FormSection`.
- `ColorField` :
  - [x] Props `colorCount` et `onColorCountChange`.
  - [x] Switch placé sous la ligne de titre (« Couleurs – <nom> »), au-dessus des onglets.
  - [x] Onglets masqués en mode `1`, sans animation.
  - [x] Libellé d'accessibilité du nuancier : « Couleur » en mode `1`, « Couleur N » sinon.
  - [x] Espacements par tokens dans `ColorField.styles.ts` (en ajouter un dans `tokens.ts` si aucun ne convient).
- [x] `AppearanceScreen` : nouvelle prop `initialColorCount: ColorCount`, branchée sur `useColorEditing`. `randomizeDesign` synchronise le mode.
- [x] `DraftAppearanceScreen` : `initialColorCount(draft)`. `MedAppearanceScreen` : `colorCountOf(med.design)`.
- [x] i18n (namespace `pillbox`) : `make i18n-extract`, puis traductions EN dans `src/shared/i18n/locales/en/pillbox.json` (« One color », « Two colors », « Number of colors », « Color »).

## Étape 5 — Tests de l'écran

- Dans `AppearanceScreen.spec.tsx` :
  - [x] Ouverture : nouveau médicament blanc / blanc → « Deux couleurs » ; médicament existant avec deux couleurs identiques → « Une couleur » ; couleurs différentes → « Deux couleurs ».
  - [x] Passage à « Une couleur » : onglets masqués, couleur 1 appliquée aux deux moitiés.
  - [x] En mode « Une couleur », un choix au nuancier ou au slider colore les deux moitiés.
  - [x] Retour à « Deux couleurs » : moitiés identiques, onglet « Couleur 1 » sélectionné.
  - [x] Aléatoire : le switch suit le résultat (couleurs différentes ou identiques).
- [x] `MedAppearanceScreen.spec.tsx` : ouverture sur « Une couleur » pour un médicament aux deux couleurs identiques.

## Étape 6 — Fin

- [x] `make tests` passe.
- [ ] Tu vérifies sur l'iPhone et le Galaxy S9 : création, édition depuis la fiche et depuis une prise, aléatoire, VoiceOver / TalkBack, grand texte (iPhone 12 mini).
- [ ] Proposer une mise à jour de `CLAUDE.md` / docs si besoin (après ta validation seulement).
