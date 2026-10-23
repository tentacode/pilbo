# Spec 14 — Réglages

## Contexte

Remplacer l'écran Réglages provisoire par celui du design : notifications, intervalle par défaut, stock bas, langue, vos données, à propos, et mode debug caché (10 appuis sur la version). Spec et décisions : `specs/14_settings.md`.

À lire avant de commencer :

- `CLAUDE.md`, `docs/architecture.md`, `docs/notifications.md` (section Permission), `docs/database.md` (section Au démarrage).
- Design : artboard « Réglages » (`project/settings.dc.html`) dans https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4 (lecture avec l'outil Artifact, action `read` + `path`).
- Code existant :
  - Écran : `src/features/settings/SettingsScreen.tsx` (+ `.styles.ts`, `.spec.tsx`), `components/*Button.tsx` (+ specs).
  - Debug : `src/config/debug.ts`, `src/app/_layout.tsx`, `src/features/onboarding/utils/setupFirstLaunch.ts`, `src/shared/database/clearDatabase.ts`, `resetDatabase.ts`.
  - Store persisté de référence : `src/features/onboarding/store/onboardingStore.ts` (stockage sync).
  - Permission : `src/features/notifications/hooks/useNotificationPermission.ts`.
  - Intervalle : `src/features/pillbox/components/ReminderIntervalField.tsx` (options 5/10/15/30), `src/features/pillbox/utils/intakeDraft.ts` (`NEW_INTAKE_REMINDER_INTERVAL_MINUTES`, `createIntakeDraft`), `hooks/useIntakeDraft.tsx`.
  - Onboarding : `src/features/onboarding/components/OnboardingStep.tsx`, `onboardingSteps.ts` (étape 3).
  - Design system : `SegmentedControl`, `Stepper`, `Dialog`, `Icon` (`check`, `chevronRight`, `chevronLeft`), `Text`, `Screen`, `ScreenHeader`, `IconButton`, `utils/playPressHaptic.ts`, `tokens.ts`.
  - Routes : `src/app/_layout.tsx` (Stack racine, pas de header), `src/app/(tabs)/settings.tsx`.
  - E2E : `e2e/onboarding.yaml`.

## Étape 1 — Store des réglages

- Extraire le stockage sync de `onboardingStore.ts` dans un module partagé (ex. `src/shared/storage/synchronousStorage.ts`), réutilisé par les deux stores.
  - [x] `onboardingStore.ts` l'importe, comportement inchangé (`onboardingStore.spec.ts` passe).
- `src/features/settings/store/settingsStore.ts` : Zustand `persist`, clé dédiée.
  - [x] `defaultReminderIntervalMinutes` (10 par défaut) + setter.
  - [x] `lowStockDays` (7 par défaut, borné 1–30) + setter.
  - [x] `language: "fr" | "en" | null` (`null` par défaut) + setter.
  - [x] `partialize` sur les seules valeurs.
- Langue effective :
  - [x] Installer `expo-localization` (`pnpm expo install`).
  - [x] Fonction pure `resolveLanguage(chosen, systemLanguageCodes)` dans `features/settings/utils/` : choix de l'utilisateur, sinon première langue système fr/en, sinon `"en"`.
  - [x] Hook `useAppLanguage()` : lit le store + `getLocales()`.
- [x] Tests : store (valeurs par défaut, setters, bornes du stock) et `resolveLanguage`.

## Étape 2 — Intervalle par défaut des nouvelles prises

- [x] `createIntakeDraft` reçoit l'intervalle par défaut en paramètre (fonction pure), la constante `NEW_INTAKE_REMINDER_INTERVAL_MINUTES` disparaît.
- [x] `useIntakeDraft.tsx` passe la valeur du store des réglages pour une nouvelle prise. Une prise existante garde la sienne.
- [x] Extraire les options 5/10/15/30 de `ReminderIntervalField.tsx` dans un endroit partagé par les deux écrans (ex. `domain/intake.ts` ou `config/`), sans dupliquer.
- [x] Tests à jour : `intakeDraft.spec.ts`, `IntakeEditScreen.spec.tsx` (nouvelle prise avec un intervalle par défaut modifié).

## Étape 3 — Composants de l'écran

- Briques de mise en page dans `features/settings/components/` (tokens uniquement, Dynamic Type, cibles ≥ 44 pt) :
  - [x] `SettingsSection` : titre hors de la card (`accessibilityRole="header"`), card, texte d'aide optionnel.
  - [x] `SettingsRow` : libellé + valeur/contrôle. Variante pressable (rôle bouton, chevron) et variante statique. Passe sous le libellé quand ça ne tient pas (`useFitsInWidth`).
- Lignes :
  - [x] `NotificationsRow` : « ✓ Autorisées » non cliquable, ou « Activer » + chevron, cliquable, qui appelle `request()`. Rien tant que `isGranted` vaut `null`.
  - [x] `DefaultIntervalRow` : `SegmentedControl` + aide « Utilisé pour les nouvelles prises. Chaque prise peut avoir le sien. »
  - [x] `LowStockRow` : `Stepper` 1–30, libellés accessibles (« 7 jours »…).
  - [x] `LanguageRow` : `SegmentedControl` « Français | English ».
  - [x] `PrivacyCard` (« Vos données ») : icône cadenas + texte du design. Ajouter l'icône `lock` dans `iconShapes.tsx` si absente.
  - [x] `AboutSection` : « Revoir la présentation » (reprend `RestartOnboardingButton`, nouveau libellé), « Pilbo n'est pas une application médicale » (navigation, étape 4), « Version ».
- Version :
  - [x] Installer `expo-application`. Format « version (build) » dans `features/settings/utils/formatters.ts` (testé).
- [x] Tests RNTL de chaque ligne (états, rôles, labels, appels).

## Étape 4 — Écran « Pilbo n'est pas une application médicale »

- [x] Nouvelle route dans la Stack racine (ex. `src/app/not-medical.tsx`), protégée par `onboardingDone`, en push, sans tab bar.
- [x] Écran dans `features/onboarding/` (ex. `NotMedicalScreen.tsx`) : réutilise `OnboardingStep` avec l'étape 3 de `onboardingSteps`, sans points de progression.
- [x] Bouton « Retour » en bas, même forme et même place que les boutons de l'onboarding (`OnboardingFooter` sans points de progression), safe area, swipe iOS actif.
- [x] Focus VoiceOver sur le titre à l'ouverture (déjà fait par `OnboardingStep`).
- [x] Test RNTL : contenu affiché, retour appelé.

## Étape 5 — Mode debug

- [x] Hook `useDebugModeToggle()` (dans `features/settings/hooks/`) : compteur d'appuis, remis à 0 après 2 s sans appui, bascule au 10e appui, `playPressHaptic()` et `AccessibilityInfo.announceForAccessibility` (« Mode debug activé » / « Mode debug désactivé »). State local, non persisté.
  - [x] Test avec timers simulés (bascule, remise à 0, double bascule).
- [x] La ligne « Version » appelle le hook, sans rôle bouton.
- Section « Debug » sous « À propos », visible seulement en mode debug :
  - [x] « Supprimer les données » : `Dialog` de confirmation (textes au ton de l'app, action « Supprimer » + « Annuler »), puis comportement actuel de `ClearDatabaseButton`.
  - [x] « Réinitialiser avec des données de test » : `Dialog` de confirmation, puis comportement actuel de `ResetDatabaseButton`.
  - [x] « Simuler une erreur » : comportement actuel de `CrashTestButton`, sans modale.
  - [x] Renommer ou remplacer les composants `*Button` en lignes de la card. Leurs tests sont mis à jour (confirmation requise avant l'action, annulation sans effet).
- `EXPO_PUBLIC_DEBUG_MODE` :
  - [x] Ne sert plus qu'à `setupFirstLaunch` (`_layout.tsx`). `SettingsScreen` ne l'importe plus.
  - [x] Commentaire de `.env.dist` mis à jour (seed + onboarding sauté au 1er lancement).

## Étape 6 — Assemblage de l'écran

- [x] `SettingsScreen.tsx` : sections dans l'ordre du design (Rappels, Stock, Langue, Vos données, À propos, Debug), espacements en tokens.
- [x] Titre : « Réglages » ou « Settings » selon `useAppLanguage()`, changement instantané.
- [x] Supprimer `NotificationPermissionButton` (remplacé par `NotificationsRow`) et ce qui n'est plus utilisé.
- [x] `SettingsScreen.spec.tsx` réécrit : sections présentes, titre selon la langue, section Debug masquée puis visible après 10 appuis.
- [x] Retours : espace entre les boutons du `Stepper` et la valeur (`spacing.small`, aussi dans l'édition de prise) ; défilement automatique jusqu'à la section Debug quand elle apparaît.
- [x] `SegmentedControl` (design system) : options empilées verticalement quand elles ne tiennent pas côte à côte (mesure invisible + `useFitsInWidth`), plus de mots coupés en Dynamic Type maximal (Réglages et édition de prise).
- [x] Accessibilité : contraste AA des nouvelles paires de couleurs (ex. vert « Autorisées »), Dynamic Type au maximum sans casse, ordre de lecture VoiceOver.
- [x] `make tests` passe.
- [x] Tu vérifies sur l'iPhone (texte normal et agrandi, VoiceOver).

## Étape 7 — E2E

- [x] `e2e/onboarding.yaml` : « Refaire l'onboarding » → « Revoir la présentation ».
- [x] `e2e/settings.yaml` :
  - [x] Changer l'intervalle par défaut, puis vérifier qu'une nouvelle prise le reprend.
  - [x] Changer le stock bas et la langue (titre « Settings »).
  - [x] Ouvrir « Pilbo n'est pas une application médicale », puis revenir.
  - [x] 10 appuis sur la version : section Debug visible. 10 de plus : masquée.
- [x] `make test-e2e` passe (si l'iPhone est branché : `maestro --device <simulator id> test e2e/`).

## Étape 8 — Fin

- [x] Docs à jour :
  - [x] `docs/notifications.md` (permission depuis la ligne « Notifications » des Réglages).
  - [x] `docs/database.md` (section Au démarrage : debug et boutons des Réglages).
  - [x] `docs/architecture.md` (`shared/storage/` si créé, rôle de `EXPO_PUBLIC_DEBUG_MODE`).
- [x] `make tests` passe.
- [x] Proposer une mise à jour de `CLAUDE.md` / docs si besoin (après ta validation seulement).
