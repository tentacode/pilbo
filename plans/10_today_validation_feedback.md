# Feedback de validation sur l'écran Today (POC en 2 variantes + lune)

## Contexte

Quand on valide une prise (« Je l'ai pris », « Prendre en avance », « Ignorer »), `useIntakeValidation` appelle `refresh()` : la carte est remplacée d'un coup par la suivante. Rien n'indique ce qui s'est passé.

Objectif : tester 2 variantes d'animation (sortie simple, descente vers « Déjà prise »), l'une après l'autre, puis tu choisis. Le message de succès visible est écarté.

## Mon avis sur les 3 options

**1. Message de succès** : bof.

- Redondant visuellement, ajoute du bruit, à retirer à la main ou avec un timer.
- ⚠️ Mais une partie est utile **pour VoiceOver** : la carte disparaît, le focus est perdu, rien n'est annoncé. Une annonce vocale (`AccessibilityInfo.announceForAccessibility`) règle ça sans rien afficher.

**2. Animation de sortie de la carte** : ✅ mon choix par défaut.

- Simple, lisible, peu de risques.
- Avec Reanimated, `exiting` sur un `Animated.View` joue l'animation **après** le démontage : pas besoin de retarder la mise à jour des données.
- Ajouter `LinearTransition` pour que les cartes suivantes glissent en place au lieu de sauter.

**3. La carte descend en bas (« Déjà prise »)** : le plus parlant, mais le plus risqué.

- Montre où la prise est partie.
- Mais la section « Déjà prise » est souvent hors écran (scroll) : le mouvement sort de la vue.
- Pas de vrai « déplacement » entre deux sections avec Reanimated : on le simule (sortie vers le bas + entrée en fondu dans « Déjà prise » + les autres remontent).

**Compléments communs (dans les 2 variantes)** :

- Vibration « succès » légère (`Haptics.notificationAsync(Success)`) à la validation.
- Annonce VoiceOver (« Prise validée » / « Prise ignorée »).
- Reduce Motion activé → pas d'animation (fondu court ou rien).

**Bonus lune** : flottement lent (±3 pt en boucle) + étoiles qui scintillent (opacité), apparition en fondu. Désactivé avec Reduce Motion.

## Étapes

Après chaque étape : `make tests`, puis **je m'arrête** pour que tu testes sur iPhone (Fast Refresh suffit, pas de rebuild natif).

### Étape 0 : socle commun

- [x] Vérifier/ajouter le mock Reanimated dans `jest.setup.ts` si les tests cassent.
- [x] Ajouter tokens de durée dans `src/design-system/tokens.ts` (ex. `durations.short/medium/long`).
- [x] Haptique succès : ajouter `playSuccessHaptic` dans `src/design-system/utils/` (+ mock `notificationAsync` dans `jest.setup.ts`).
- [x] Annonce VoiceOver + haptique dans `useIntakeValidation.ts` après l'insert réussi (+ test).

### Étape 1 : animation de sortie

- [x] Envelopper les cartes de `TodayIntakeSections.tsx` dans `Animated.View` avec `key` = id de prise :
  - `exiting` : fondu + léger glissement/réduction (`FadeOut` + `ZoomOut` ou custom).
  - `entering` : fondu léger pour la nouvelle carte « Prochaine prise ».
  - `layout={LinearTransition}` pour que le reste glisse.
- [x] `.reduceMotion(ReduceMotion.System)` sur chaque animation.
- ⏸️ Test par toi.

### Étape 2 : descente vers « Déjà prise » (remplace l'étape 1) — ❌ testée, non retenue (variante 1 conservée)

- [ ] `exiting` : glissement vers le bas + fondu.
- [ ] `entering` sur les `EarlierIntakeCard` : apparition depuis le haut, avec léger délai.
- [ ] `LinearTransition` sur sections et cartes pour que tout remonte.
- [ ] Éviter l'animation au premier affichage de l'écran (`entering` seulement après une validation).
- ⏸️ Test par toi → choix de la variante, nettoyage du code des autres.

### Étape 3 : bonus lune

- [x] `TodayDoneIllustration.tsx` : `Animated` sur la lune (flottement) et les étoiles (scintillement), via `useReduceMotion`.
- [x] `TodayDoneState.tsx` : apparition en fondu + légère montée.
- ⏸️ Test par toi.

## Fichiers clés

- `src/features/today/components/TodayIntakeSections.tsx` (point central des animations de cartes)
- `src/features/today/hooks/useIntakeValidation.ts`
- `src/features/today/components/TodayDoneIllustration.tsx`, `TodayDoneState.tsx`
- `src/design-system/tokens.ts`, `src/design-system/utils/`, `jest.setup.ts`
- Réutilisés : `useReduceMotion` (`src/design-system/hooks/`), `playPressHaptic` (modèle pour l'haptique succès)

## Vérification

- Simulateur déjà lancé par toi : **je ne lance ni simulateur ni build**. Aucune nouvelle dépendance native prévue (Reanimated et expo-haptics déjà installés) → Fast Refresh suffit. Si un rebuild devient nécessaire, je te le dis.
- `make tests` vert à chaque étape.
- Sur iPhone : valider une prise next / later / late / ignorer, puis la dernière (→ lune).
- Réglages iOS : Reduce Motion activé → pas de mouvement ; VoiceOver → annonce entendue, focus cohérent.

## Après validation

Copier ce plan dans `./plans/10_today_validation_feedback.md` et cocher au fur et à mesure.
