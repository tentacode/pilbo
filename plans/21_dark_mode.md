# Spec 21 — Dark mode

## Contexte

Thème sombre : l'app suit iOS par défaut, un réglage « Apparence » (Clair / Sombre) force un thème et a la priorité. Couleurs sombres proposées par Claude, validées écran par écran. Spec : `specs/21_dark_mode.md`.

À lire avant de commencer :

- `CLAUDE.md`, `docs/architecture.md` (i18n, accessibilité).
- Code existant :
  - Tokens : `src/design-system/tokens.ts` (`colors`, `pillSwatches`, `customColorWheel`), `utils/color.ts`.
  - Thème clair forcé : `app.config.ts` (`userInterfaceStyle: "light"`, splash `backgroundColor`), `src/app/_layout.tsx` (`<StatusBar style="dark" />`).
  - Modèle à suivre (langue) : `features/settings/store/settingsStore.ts` (`language: AppLanguage | null`), `hooks/useAppLanguage.ts`, `hooks/useI18nLanguageSync.ts`, `utils/appLanguage.ts` (`getAppLanguage`), `components/LanguageRow.tsx`, `setI18nLanguage(getAppLanguage())` avant le premier rendu dans `_layout.tsx`.
  - Couleurs hors `StyleSheet` : props `color={colors.…}` (ex. `IntakeStatusLabel.tsx`, `SettingsRow.tsx`), SVG via `react-native-svg` (ex. `TodayHeaderDecoration.tsx`, `TodayDoneIllustration.tsx`, `Illustration/illustrationStrokes.ts`), `calendar/components/dayStatusAppearances.ts`, `onboarding/components/onboardingSteps.ts`.

## Approche

- `lightColors` et `darkColors` : palettes brutes (hex), mêmes clés, testables.
- `colors` : chaque token = `DynamicColorIOS({ light, dark })`. Les `StyleSheet` existants restent inchangés. iOS uniquement (Android hors scope).
- Thème forcé : `Appearance.setColorScheme(choix ?? "unspecified")`, appliqué avant le premier rendu puis synchronisé avec le store. Barre de statut, clavier, sélecteurs natifs et `Alert` suivent.
- Là où une couleur brute est nécessaire (SVG si non compatible, calculs), hook `useThemeColors()` qui renvoie la palette du thème courant.
- Couleurs des médicaments (`pillSwatches`, `customColorWheel`, couleur personnalisée) inchangées.

# Arrêt 1 — Socle

## Étape 1 — Vérification SVG

- [x] Sur le simulateur, un `fill` / `stroke` `DynamicColorIOS` dans `react-native-svg` suit le thème (passer iOS en sombre).
- [x] Noter le résultat ici : SVG compatibles, ou SVG via `useThemeColors()`.
  - Résultat : **SVG compatibles**, `fill` / `stroke` suivent le thème en direct (clair → sombre → clair). Types `string` des couleurs passés en `ColorValue`.

## Étape 2 — Tokens

- [x] `tokens.ts` : `lightColors` (valeurs actuelles), `darkColors` (proposition : fond violet très sombre, texte lavande clair, pastels en teintes sombres désaturées pour les fonds, accents clairs, états adaptés).
- [x] `colors` construit à partir des deux palettes avec `DynamicColorIOS`, même type de clés.
- [x] `useThemeColors()` (design-system/hooks) : palette brute du thème courant (`useColorScheme`).
- [x] Token `onAccent` (encre foncée dans les deux thèmes) pour les traits posés sur un accent clair : cadenas de l'onboarding « Vos données ».
- [x] Contours des pastilles de couleur des médicaments visibles sur fond sombre (`swatchOutline`, `colorDotOutline`, `sliderOutline`).

## Étape 3 — Contrastes AA

- [x] Fonction de ratio de contraste dans `utils/color.ts` (+ tests).
- [x] `tokens.spec.ts` : liste des paires texte / fond utilisées, AA (4,5:1 texte, 3:1 icônes et contours utiles) vérifié pour `lightColors` et `darkColors`.

## Étape 4 — Réglage et thème

- [x] `settingsStore` : `colorScheme: AppColorScheme | null` (`"light" | "dark"`), `setColorScheme`, persisté (`partialize`).
- [x] `useAppColorScheme()` : choix app, sinon `useColorScheme()` iOS, sinon `"light"`.
- [x] `useColorSchemeSync()` : `Appearance.setColorScheme` au changement du store. Appel initial avant le premier rendu dans `_layout.tsx` (pas de flash).
- [x] `app.config.ts` : `userInterfaceStyle: "automatic"`, splash avec variante sombre.
- [x] `<StatusBar style="auto" />`.
- [x] Tests : résolution du thème (choix > iOS > clair), store.

## Étape 5 — Ligne « Apparence »

- [x] `AppearanceRow` (comme `LanguageRow`) sous « Langue de l'app » : « Clair », « Sombre », sélection = thème courant si rien n'est choisi.
- [x] Icônes soleil / lune sur les options (`SegmentedControl` : `icon` optionnel), section « Langue » renommée « Affichage ».
- [x] Textes FR/EN (`make i18n-extract`, namespace `settings`).
- [x] Tests : sélection initiale suit iOS, changement en live, accessibilité (`SegmentedControl`).

- [x] `make tests` passe.
- [x] Captures simulateur : palette en clair et en sombre (Aujourd'hui, Réglages).

Je m'arrête et j'attends ta validation.

# Arrêts 2 à 8 — Écran par écran

Pour chaque écran :

- Couleurs en dur et SVG passés au thème (selon le résultat de l'étape 1).
- Tokens ajustés si besoin (contrastes toujours AA, `tokens.spec.ts` à jour).
- Captures simulateur en clair et en sombre, avec texte agrandi si l'écran est dense.
- `make tests` passe.

Je m'arrête après chaque arrêt et j'attends ta validation.

## Arrêt 2 — Navigation et design-system

- [x] Barre d'onglets (fond translucide, badges).
- [x] `Button`, `IconButton`, `Sheet` (fond, poignée, voile), `Dialog`, `TextField`, `SegmentedControl`, `Stepper`, `ColorSwatch`, `ColorSlider`, `ColorWheel`, `Pill` (reflet), `Illustration`.
- [x] Ombres (`shadowColor`) adaptées au fond sombre : token `shadow` (noir en sombre).
- [x] Pilules : jonction et rainure en `onAccent` (foncé dans les deux thèmes), contour clair en sombre pour rester visible.
- [x] `Dialog` sur `surface` (se détachait mal de la feuille en sombre).
- [x] `ActionSheetIOS` : `tintColor` en couleur brute (`useThemeColors()`, crash avec `DynamicColorIOS`), plus de `userInterfaceStyle: "light"` forcé.
- [x] `make tests` passe.
- [x] Validation.

## Arrêt 3 — Aujourd'hui

- [x] En-tête et décoration, cartes (à venir, en retard, prise, ignorée), hors planning, bandeaux (stock bas, rappels), état « tout est fait ».
- [x] Prises en retard et bandeau stock bas (retour arrêt 1) : le rouge foncé terne rend mal en sombre. Essayer un fond rouge clair avec texte foncé, comparer sur captures.
  - Bandeau stock bas, pastilles « En retard », jour manqué du calendrier : fond rouge clair (`alertNotice`, `alertChip`) et texte foncé (`onAlert`, ton `Text` « onAlert »).
  - Cartes en retard / manquées : fond sombre légèrement teinté (`alertBackground`), bordure rouge vive (`alertLine`), séparateurs `alertSeparator`.
  - `alertInk` reste le rouge lisible sur les fonds du thème (erreurs de champ, chiffres de stock bas, barre de progression).
  - Clair inchangé.
- [x] Bouton « Je l'ai pris » des cartes en retard : variante `prominent` du `Button` (clair : identique à `primary` ; sombre : fond sombre, bordure et texte lavande vifs).
- [x] Jour passé, calendrier (`dayStatusAppearances.ts`, légende, contour « Aujourd'hui »), édition d'une prise du jour.
- [ ] Validation.

## Arrêt 4 — Pilulier

- [ ] Liste des prises, actions sur un médicament.
- [ ] Édition d'une prise (jours, heure, médicaments, quantités).
- [ ] Validation.

## Arrêt 5 — Médicament

- [ ] Ajout / modification d'un médicament.
- [ ] Apparence du médicament (formes, couleurs, couleur personnalisée).
- [x] ~~Couleurs par défaut des médicaments~~ : plus nécessaire après les corrections des pilules (arrêt 2).
- [ ] Choix d'un médicament (med-picker).
- [ ] Validation.

## Arrêt 6 — Stocks

- [ ] Liste des stocks, édition d'un stock.
- [ ] Stock bas : même traitement du rouge que l'arrêt 3.
- [ ] Validation.

## Arrêt 7 — Réglages

- [ ] Sections, lignes, carte de confidentialité, section debug.
- [ ] Validation.

## Arrêt 8 — Onboarding et écrans à part

- [ ] Onboarding (étapes, indicateur, illustrations, `onboardingSteps.ts`).
- [ ] « Pas une application médicale », écran d'erreur de la base.
- [ ] Validation.

# Arrêt 9 — Finitions

- [ ] Plus aucun hex en dur hors `tokens.ts` (sauf couleurs des médicaments et fixtures).
- [ ] Maestro `e2e/dark_mode.yaml` : passer en « Sombre » dans les réglages, parcourir les onglets, revenir en « Clair ».
- [ ] `docs/architecture.md` : section « Thème » (tokens dynamiques, `useThemeColors()` pour les couleurs brutes, ajout d'un token dans les deux palettes, test de contraste).
- [ ] Proposition de règle pour `CLAUDE.md` (« couleurs via les tokens du thème »), à valider avant modification.
- [ ] `make tests` passe.
- [ ] Tu vérifies sur l'iPhone : thème iOS et réglage de l'app, VoiceOver sur « Apparence », texte agrandi, mode auto du soir.

Je m'arrête et j'attends ta validation.
