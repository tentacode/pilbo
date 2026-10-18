# Spec 10 — Onboarding

## Contexte

Afficher 4 écrans d'onboarding au premier lancement, demander la permission des notifications depuis l'onboarding (plus au lancement), et arriver sur un Pilulier vide. Spec et décisions : `specs/10_onbparding.md`.

À lire avant de commencer :

- `CLAUDE.md`, `docs/architecture.md`, `docs/database.md`, `docs/notifications.md`.
- Design (Claude Design) : `https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4`, artboards `project/onboarding-1.dc.html` à `project/onboarding-4.dc.html`, `project/empty-pilulier.dc.html`, styles `project/pilbo.css` (`.illu`, `.onb-text`, `.onb-foot`, `.pager`, `.btn`, `.btn-t`, `.page-empty`, `.art`, `.et`, `.eb`, `.il-f`, `.il-o`, `.il-t`, `.il-s`, `.pf`, `.ps`, `.ph`). Lecture via l'outil Artifact, action `read` avec `path`.
- Code existant :
  - `src/app/_layout.tsx`, `src/app/index.tsx`, `src/app/(tabs)/_layout.tsx`.
  - `src/shared/database/hooks/useDatabaseReady.ts`, `seed.ts`, `resetDatabase.ts`, `clearDatabase.ts`.
  - `src/features/notifications/notifications.ts`, `hooks/useReminderScheduling.ts`, `rescheduleReminders.ts`.
  - `src/features/today/hooks/useRemindersEnabled.ts`, `components/RemindersDisabledNotice.tsx` (`Linking.openSettings()`).
  - `src/features/settings/SettingsScreen.tsx`, `components/ClearDatabaseButton.tsx`, `components/ResetDatabaseButton.tsx`.
  - `src/features/pillbox/PillboxScreen.tsx`, `hooks/usePillboxData.ts`.
  - Modèles d'empty state et d'illustration SVG : `src/features/today/components/TodayEmptyState.tsx`, `TodayEmptyIllustration.tsx`.
  - Design system : `Button` (variantes `primary`, `secondary`, `text`), `Text`, `Screen`, `hooks/useReduceMotion.ts`, `tokens.ts`.
  - `e2e/*.yaml`, `jest.setup.ts`.

Tu peux enchaîner les étapes jusqu'à l'arrêt de l'étape 6, mais pose des questions en cas de doute.

## Étape 1 — Store Zustand persisté

- [x] `pnpm add zustand` (JS uniquement, pas de rebuild natif).
- [x] `src/features/onboarding/store/onboardingStore.ts` :
  - `useOnboardingStore` : `onboardingDone: boolean` (défaut `false`), `setOnboardingDone(value)`.
  - `persist` + `createJSONStorage(() => Storage)` avec `Storage` de `expo-sqlite/kv-store` (API synchrone : pas d'attente d'hydratation).
  - `isFirstLaunch()` : vrai si la clé du store est absente du kv-store (`Storage.getItemSync`), à lire **avant** toute écriture du store.
- [x] Jest : mock de `expo-sqlite/kv-store` dans `jest.setup.ts` (Map en mémoire, `getItemSync`/`setItemSync`/`removeItemSync` + versions async si `createJSONStorage` les utilise).
- [x] Tests `onboardingStore.spec.ts` : défaut `false`, `setOnboardingDone`, valeur relue depuis le stockage, `isFirstLaunch`.
- [x] `make tests` passe.

## Étape 2 — Seed au premier lancement (debug)

- [x] `useDatabaseReady` (`shared/`) ne seed plus : il migre seulement, et accepte un callback `onMigrated` appelé avant `isReady` (`shared/` ne peut pas importer `features/`).
- [x] `src/features/onboarding/utils/setupFirstLaunch.ts` : `setupFirstLaunch(database, { isDebugMode, isFirstLaunch })` :
  - Premier lancement + debug : `seedDatabase(database, { withLogs: __DEV__ })` et `onboardingDone = true`.
  - Sinon : rien.
- [x] `src/app/_layout.tsx` : passe `setupFirstLaunch` (avec `IS_DEBUG_MODE` de `config/debug.ts`) à `useDatabaseReady`.
- [x] Échec du seed : même traitement qu'aujourd'hui (`DatabaseErrorScreen`).
- [x] Tests `setupFirstLaunch.spec.ts` (base en mémoire `createTestDatabase({ seed: false })`) : les 4 combinaisons debug / premier lancement.
- [x] `docs/database.md` : seed au premier lancement en debug seulement, plus de re-seed quand la base est vide (sections fichiers et « Vider la base »).
- [x] `make tests` passe.

## Étape 3 — Permission des notifications

- [x] `useReminderScheduling.ts` : retirer `requestPermission()` au lancement, garder la replanification (lancement + retour au premier plan).
- [x] `notifications.ts` : `getPermissionStatus(): Promise<"granted" | "denied" | "undetermined">` (`getPermissionsAsync`, `canAskAgain` pour distinguer refusé / jamais demandé).
- [x] `src/features/notifications/hooks/useNotificationPermission.ts` : `{ isGranted, request }`.
  - Statut relu au focus et au retour au premier plan (reprendre la logique de `useRemindersEnabled`).
  - `request()` : `undetermined` → popup (`requestPermission`), `denied` → `Linking.openSettings()`, `granted` → rien.
  - Après autorisation : `rescheduleReminders(database, new Date())` (erreur en console seulement).
- [x] `useRemindersEnabled` : le remplacer par `useNotificationPermission` si c'est le même besoin (sinon le garder).
- [x] `RemindersDisabledNotice` (Aujourd'hui) : bouton « Activer les notifications » → `request()` (avant : « Ouvrir les Réglages », inutile si jamais demandée).
- [x] Tests du hook (mock `expo-notifications` + `Linking`) : les 3 statuts, relecture au premier plan.
- [x] `docs/notifications.md` : permission demandée depuis l'onboarding et Réglages, plus au lancement.
- [x] `make tests` passe.

## Étape 4 — Routage

- [x] Route `src/app/onboarding.tsx` : `export { OnboardingScreen as default } from "@/features/onboarding/OnboardingScreen";`
- [x] `src/app/_layout.tsx` : `Stack.Protected` avec `guard={!onboardingDone}` pour `onboarding`, `guard={onboardingDone}` pour `(tabs)` (pas de header, cf. mémoire).
- [x] `src/app/index.tsx` : redirige vers `/onboarding` ou `/today` selon `onboardingDone`.
- [x] Vérifier que `useOpenTodayOnNotification` ne casse pas l'onboarding (il vit dans `(tabs)`).
- [x] `make tests` passe.

## Étape 5 — Écrans d'onboarding

- `src/features/onboarding/` :
  - [x] `OnboardingScreen.tsx` : étape courante en state local (0 à 3), aucun retour, aucun swipe.
  - [x] `components/OnboardingStep.tsx` (+ styles) : illustration, titre (`accessibilityRole="header"`), texte. Textes exacts du design.
  - [x] `components/OnboardingPager.tsx` (+ styles) : la « track » (4 points, le courant allongé), annoncée « Étape N sur 4 ».
  - [x] `components/OnboardingFooter.tsx` (+ styles) : track + boutons de l'étape.
  - [x] 4 illustrations SVG (`react-native-svg`), une par fichier, couleurs en tokens (ajouter les tokens manquants), libellés d'accessibilité repris des `aria-label` du design.
- Boutons par étape :
  - [x] 1 « Continuer » → étape 2.
  - [x] 2 « Autoriser les notifications » → `request()` ; passe à l'étape 3 dès que `isGranted` devient vrai (popup ou retour des Réglages iOS). « Plus tard » (variante `text`) → étape 3.
  - [x] 3 « J'ai compris » → étape 4.
  - [x] 4 « Créer ma première prise » → `setOnboardingDone(true)` puis `router.replace("/pillbox")`.
- Accessibilité :
  - [x] Au changement d'étape, focus VoiceOver sur le titre.
  - [x] Dynamic Type : contenu scrollable si besoin, pas de hauteur fixe sur le texte, boutons ≥ 44 pt.
  - [x] Contraste AA des paires de couleurs ajoutées.
- [x] Tests RNTL `OnboardingScreen.spec.tsx` : parcours complet, « Plus tard », permission accordée → étape suivante, refus → reste, fin → store à `true` + navigation.
- [x] `make tests` passe.

## Étape 6 — Transitions (2 variantes)

- [x] `components/OnboardingStepTransition.tsx` : enveloppe illustration + texte (la track et les boutons restent fixes), Reanimated `entering`/`exiting`.
  - Variante « fondu » (`FadeIn` / `FadeOut`).
  - Variante « glissement » (`SlideInRight` / `SlideOutLeft`).
  - Aucune animation si « Réduire les animations » (`ReduceMotion.System` de Reanimated, comme dans `features/today`).
- [x] Choix de la variante par une constante temporaire dans le fichier, pour basculer facilement.
- [x] Tu testes les 2 variantes sur le simulateur ou l'iPhone.

Je m'arrête et j'attends ta validation.

- [x] Garder la variante choisie, supprimer l'autre et la constante.

## Étape 7 — Pilulier vide

- [x] `src/features/pillbox/components/PillboxEmptyState.tsx` (+ styles) et `PillboxEmptyIllustration.tsx` : « Votre pilulier est vide », « Une prise regroupe une heure, des jours et les médicaments à prendre ensemble. », boutons « Créer une prise » (icône `plus`) et « Ajouter un médicament hors planning » (variante `text`), sans action.
- [x] `PillboxScreen.tsx` : empty state si aucune prise et aucun médicament hors planning.
- [x] Test RNTL : empty state affiché sur base vide, liste sinon.
- [x] `make tests` passe.

## Étape 8 — Réglages

- [x] `features/settings/components/NotificationPermissionButton.tsx` : « Accepter les notifications », `useNotificationPermission`, masqué si `isGranted`. Toujours affiché (hors section debug).
- [x] `features/settings/components/RestartOnboardingButton.tsx` : « Refaire l'onboarding », `setOnboardingDone(false)` (le `Stack.Protected` affiche l'onboarding). Toujours affiché.
- [x] `ClearDatabaseButton` : `setOnboardingDone(false)` après `clearDatabase`.
- [x] `ResetDatabaseButton` : `setOnboardingDone(true)` après `resetDatabase`.
- [x] `SettingsScreen.tsx` : les 2 nouveaux boutons au-dessus de la section debug (`accessibilityHint` sur chacun).
- [x] Tests RNTL des 4 boutons (store, permission mockée) + `SettingsScreen.spec.tsx` à jour.
- [x] `make tests` passe.

## Étape 9 — Maestro

- [x] Flows existants (`e2e/pillbox.yaml`, `today.yaml`, `today-validation.yaml`) : retirer ou adapter la gestion de la popup « Autoriser » au lancement. Ils supposent `EXPO_PUBLIC_DEBUG_MODE=true` (premier lancement = seed + onboarding fait).
- [x] `e2e/onboarding.yaml` : Réglages → « Refaire l'onboarding » → « Continuer » → « Plus tard » → « J'ai compris » → « Créer ma première prise » → Pilulier visible.
- [x] `make test-e2e` passe.

## Étape 10 — Vérifications sur iPhone

- [ ] Tu vérifies sur le simulateur ou l'iPhone : install neuve en debug (pas d'onboarding, données de test), « Vider la base » (onboarding, puis Pilulier vide, aussi après relance), « Réinitialiser la base », « Refaire l'onboarding ».
- [ ] Tu vérifies la permission : popup sur le bouton, refus → reste, déjà refusé → Réglages iOS puis retour, bouton de Réglages masqué une fois autorisé, rappels planifiés après autorisation.
- [ ] Tu vérifies VoiceOver, Dynamic Type et « Réduire les animations ».
- [ ] Tu installes le build Release (`make build-release`, debug à `false`) : onboarding au premier lancement, Pilulier vide.

## Étape 11 — Fin

- [x] `make tests` passe.
- [x] Proposer une mise à jour de `CLAUDE.md` (Zustand persist autorisé pour les petits réglages d'UI, via `expo-sqlite/kv-store`) et de `docs/architecture.md` (dossier `store/` dans une feature) — après ta validation seulement.
