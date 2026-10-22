# Spec 13 — Responsive et tweaks

## Contexte

Corriger les écrans qui cassent sur un petit iPhone (12 mini) : jours, médicaments de la prise, color picker. Fixer le fond « pilules » d'Aujourd'hui en haut de l'écran. Spec et décisions : `specs/13_responsive_and_tweaks.md` (captures dans `specs/13/`).

À lire avant de commencer :

- `CLAUDE.md`, `docs/architecture.md`.
- Mémoire : Reanimated `entering`/`exiting` perdent les translations en Release (utiliser des shared values).
- Code existant :
  - Jours : `src/features/pillbox/components/IntakeDaysField.tsx` (+ `.styles.ts`), `DayButton.tsx` (+ `.styles.ts`, `flex: 1` = cause de l'ovale).
  - Médicaments : `src/features/pillbox/components/IntakeMedEditRow.tsx` (+ `.styles.ts`), `IntakeMedsField.tsx`, `MedName.tsx`, `design-system/components/Stepper/`.
  - Couleur : `src/features/pillbox/AppearanceScreen.tsx` (ouverture du panneau + `scrollToEnd`), `components/ColorField.tsx` (+ `.styles.ts`), `components/CustomColorPanel.tsx`, `hooks/useColorEditing.ts`, `design-system/components/ColorSwatch/`, tokens `pillSwatches` et `customColorWheel`.
  - Fond : `src/features/today/TodayScreen.tsx`, `components/TodayHeader.tsx` (+ `.styles.ts`), `components/TodayHeaderDecoration.tsx`, `design-system/components/Screen/Screen.tsx` (+ `.styles.ts`).
  - Tests : `IntakeEditScreen.spec.tsx`, `AppearanceScreen.spec.tsx`, `ColorSwatch.spec.tsx`, `TodayScreen.spec.tsx`, `TodayHeader.spec.tsx`, `e2e/*.yaml`.

## Étape 1 — Mesure de largeur partagée

- `src/design-system/hooks/useFitsInWidth.ts` (nom à ajuster) :
  - [x] Retourne un `onLayout` et un booléen « le contenu tient », à partir d'une largeur minimale requise.
  - [x] Pas de clignotement visible au premier rendu (choisir un état initial sensé).
  - [x] Test unitaire (simulation de `onLayout`).
- [x] Tokens nécessaires dans `tokens.ts` (diamètre des jours, largeur minimale du texte d'un médicament).

## Étape 2 — Jours

- `DayButton` : rond de taille fixe (`width` = `height`, ≥ `sizes.touchTarget`, grandit avec le Dynamic Type via `useWindowDimensions().fontScale` ou mesure du texte), plus de `flex: 1`.
  - [x] Libellé centré, pas de coupure.
- `IntakeDaysField` :
  - [x] Mesure de la largeur (étape 1) : si 7 ronds + espacements tiennent → une ligne, sinon 2 lignes Lu → Ve puis Sa Di.
  - [x] Lignes centrées horizontalement.
  - [x] Ordre de lecture VoiceOver inchangé (Lu → Di).
- [x] Test RNTL : les 7 jours restent présents et sélectionnables dans les deux dispositions.
- [x] `make tests` passe.
- [x] Tu vérifies sur l’iPhone (taille de texte normale et agrandie).

Je m'arrête et j'attends ta validation.

## Étape 3 — Médicaments de la prise

- `IntakeMedEditRow` :
  - [x] Mesure de la largeur de la ligne (étape 1) : si la place pour le texte passe sous le seuil (token), disposition en colonne.
  - [x] Disposition en colonne : bouton pilule + nom + chevron en haut (pleine largeur), `Stepper` en dessous, aligné à droite (sous le chevron).
  - [x] Libellés d'accessibilité inchangés.
- [x] Test RNTL : stepper et bouton du médicament présents dans les deux dispositions.
- [x] `make tests` passe.
- [x] Tu vérifies sur l'iPhone (nom long, avec détail, texte agrandi).

Je m'arrête et j'attends ta validation.

## Étape 4 — Bouton « Autre couleur »

- `ColorField` :
  - [x] Les 6 pastilles restent sur une ligne en haut ; retirer la pastille « Autre couleur ».
  - [x] Nouveau bouton « Autre couleur » sous les pastilles, sur tous les téléphones, qui ouvre `CustomColorPanel` en dessous (logique de `useColorEditing` et `scrollToEnd` conservée).
  - [x] Accessibilité : `accessibilityRole`, `accessibilityState.selected` (couleur perso active) et `expanded` (panneau ouvert), cible ≥ 44 pt, contraste AA, Dynamic Type.
- Variantes :
  - [x] Coder 2 ou 3 variantes du bouton (composants séparés dans `features/pillbox/components/`), faciles à basculer (ex. constante temporaire).
  - [x] Je m'arrête : tu testes les variantes sur l'iPhone et tu en choisis une.
  - [x] Supprimer les variantes non retenues et le code de bascule.
- [x] Tests à jour : `AppearanceScreen.spec.tsx`, `ColorSwatch.spec.tsx` (et le composant `ColorSwatch` si la pastille multicolore n'est plus utilisée : vérifier avant de supprimer).
- [x] `make tests` passe.
- [x] Tu vérifies sur l'iPhone la variante retenue.

Je m'arrête et j'attends ta validation.

## Étape 5 — Fond « pilules » fixe sur Aujourd'hui (abandonnée)

> Testé sur l'iPhone : rendu jugé bizarre, retour à l'état initial (fond qui défile avec le titre).

- `Screen` : prop optionnelle `background` (`ReactNode`), rendue en absolu en haut de l'écran derrière le `ScrollView` (le `ScrollView` devient transparent, la couleur de fond passe sur le conteneur).
  - [x] Fond ignoré par VoiceOver et par les touchers (`pointerEvents="none"`).
- `TodayScreen` / `TodayHeader` :
  - [x] Sortir `TodayHeaderDecoration` de `TodayHeader`, le passer en `background` de `Screen` (position haute équivalente à l'actuelle, safe area comprise).
  - [x] Le titre « Aujourd'hui » défile normalement.
  - [x] Vérifier le contraste AA du contenu qui passe par-dessus le fond.
- [x] Tests à jour : `TodayHeader.spec.tsx`, `TodayScreen.spec.tsx`.
- [x] `make tests` passe.
- [x] Tu vérifies sur l'iPhone (si le résultat ne te plaît pas, on revient en arrière).
- [x] Retour en arrière : `Screen`, `TodayHeader`, `TodayScreen` remis comme avant, `Screen.spec.tsx` supprimé.

Je m'arrête et j'attends ta validation.

## Étape 6 — Fin

- [x] `make test-e2e` passe (sur simulateur : `maestro --device <simulator id> test e2e/` si l'iPhone est branché).
- [x] `make tests` passe.
- [x] Proposer une mise à jour de `CLAUDE.md` / docs si besoin (après ta validation seulement).
