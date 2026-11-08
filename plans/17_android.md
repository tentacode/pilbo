# Spec 17 — Android

## Contexte

Rendre Pilbo compatible Android (11 minimum) sans rien changer au rendu ni au comportement iOS : couleurs sans `DynamicColorIOS`, build et signature Android, composants natifs Material, notifications fiables. Spec et décisions : `specs/17_android.md`.

À lire avant de commencer :

- `CLAUDE.md`, `docs/architecture.md`, `docs/notifications.md`, `docs/ios_build.md` (modèle de `docs/android_build.md`).
- Code existant :
  - Couleurs : `src/design-system/tokens.ts` (`colors`, `DynamicColorIOS`, `lightColors`, `darkColors`, `createShadows`), `src/design-system/utils/createThemedStyles.ts`, `src/design-system/hooks/useThemeColors.ts`, `eslint.config.js` (règle `no-restricted-syntax` sur `colors`), `src/features/settings/hooks/useColorSchemeSync.ts`.
  - Config : `app.config.ts` (variantes, plugins), `plugins/withoutPushEntitlement.js`, `plugins/withSqliteHeader.js`, `Makefile`, `.env.dist`, `fastlane/Fastfile` (prebuild iOS seul).
  - Icône et splash : `scripts/generateArtwork.mjs`, `assets/artwork/config.ts`, `assets/images/`.
  - Composants iOS : `src/features/pillbox/components/IntakeTimeRow.tsx` (`@expo/ui/swift-ui`), `src/features/pillbox/hooks/useMedRowActionSheet.ts` (`ActionSheetIOS`).
  - Modales : `src/app/_layout.tsx` (`presentation: "modal"`), `src/features/pillbox/hooks/useModalClosing.ts` (`usePreventRemove`, `gestureEnabled`), `components/DiscardChangesDialog.tsx`.
  - Notifications : `src/features/notifications/notifications.ts`, `utils/planReminders.ts`, `utils/planLowStockAlerts.ts` (`interruptionLevel`), `hooks/useNotificationPermission.ts`, `hooks/useReminderScheduling.ts`, `src/features/onboarding/hooks/useOnboardingProgress.ts`, `src/features/settings/components/NotificationsRow.tsx`.
  - Tests : `package.json` (config Jest, preset `jest-expo`), `jest.setup.ts`, `e2e/*.yaml`.

# Arrêt 1 — Couleurs sans `DynamicColorIOS` (iOS uniquement)

## Étape 1 — Migration des fichiers de styles

- Chaque `*.styles.ts` qui utilise `colors.*` (~28 fichiers) : `StyleSheet.create` → `createThemedStyles((themeColors) => ({...}))`, export `useStyles`, `colors.x` → `themeColors.x`.
  - [x] Fichiers migrés, composants à jour (`const styles = useStyles()`).

## Étape 2 — Migration des couleurs passées en props

- Composants qui passent `colors.*` en props (`Icon`, SVG, `tint` de `IntakeTimeRow`…) : `const themeColors = useThemeColors()`.
  - [x] Composants migrés.
  - [x] Tables de constantes hors composant (ex. `src/features/calendar/components/dayStatusAppearances.ts`, `src/features/today/components/IntakeStatusLabel.tsx`, `TodayEmptyIllustration.tsx`) : nom de la couleur (`ColorName`) au lieu de la valeur, résolu dans le composant.

## Étape 3 — Suppression de `colors`

- [x] `tokens.ts` : supprimer `colors` et l'import `DynamicColorIOS` (exporter `ColorName` si utile).
- [x] `eslint.config.js` : la règle interdit tout usage de `colors` (import depuis `tokens`), message mis à jour.
- [x] Tests Jest qui vérifiaient des couleurs ajustés.
- [x] `docs/architecture.md` : section « Conventions de fichiers » (bordures, ombres) réécrite : toutes les couleurs via `createThemedStyles` / `useThemeColors`.
- [x] `make tests` passe.
- [x] `make test-e2e` passe.
- [x] Tu vérifies sur l'iPhone : clair, sombre, thème choisi dans l'app (Réglages), changement de thème à chaud, aucun écran différent d'avant.

Je m'arrête et j'attends ta validation.

# Arrêt 2 — Android

## Étape 4 — Environnement

- Vérifier l'existant, puis te guider pour les mises à jour (interface d'Android Studio) :
  - [x] Android Studio à jour (actuellement 2024.1).
  - [x] SDK Platform 36, build-tools 36 (SDK Manager).
  - [x] Image d'émulateur Android 17, émulateur créé (AVD Manager).
  - [x] `ANDROID_HOME`, `$ANDROID_HOME/platform-tools` et `$ANDROID_HOME/emulator` dans le PATH (profil zsh), `adb` et `emulator` répondent.
  - [x] `JAVA_HOME` sur Java 17 (Zulu 17).
- [x] `make install` : vérifie `ANDROID_HOME`, `adb` et Java 17, avec un message d'aide si absent (comme ccache et Ruby).
- [x] `docs/android_build.md` : prérequis et mise en place de l'environnement.

## Étape 5 — Configuration Android

- `app.config.ts`, section `android` :
  - [x] `package` selon la variante (`com.tentacode.pilbo.dev` / `com.tentacode.pilbo`), nom affiché selon la variante.
  - [x] Permissions : `USE_EXACT_ALARM`, `SCHEDULE_EXACT_ALARM` avec `maxSdkVersion` 32 (plugin de config si `permissions` ne le permet pas), `RECEIVE_BOOT_COMPLETED` si `expo-notifications` ne l'ajoute pas déjà. Vérifier dans le manifeste généré.
  - [x] `minSdkVersion` 30 via `expo-build-properties` (`android`), `targetSdk` / `compileSdk` laissés par défaut (36).
- [x] `expo-notifications` : son `beep.wav` copié dans `res/raw` au prebuild (vérifier).
- [x] Les plugins `withoutPushEntitlement` et `withSqliteHeader` ne cassent pas le prebuild Android.
- [x] `.env.dist` : nouvelles variables (`ANDROID_DEVICE_ID`, keystore), commentées.

## Étape 6 — Icône adaptative et splash

- `scripts/generateArtwork.mjs` (réglages dans `assets/artwork/config.ts`) :
  - [x] Calque de fond (motif de petites pilules) et avant-plan (grosse gélule dans la zone sûre), variante DEV avec bandeau dans la zone sûre.
  - [x] PNG générés dans `assets/images/`, `make artwork`.
- [x] `app.config.ts` : `android.adaptiveIcon` selon la variante.
- [x] Splash Android (`expo-splash-screen`, clés `android`) : fond clair/sombre et image centrée.
- [x] `docs/architecture.md`, section « Icône et splash screen » à jour.

## Étape 7 — Makefile et premier build

- [x] `make clean` : `prebuild --clean` sans `--platform` (iOS et Android). Vérifier que `fastlane/Fastfile` reste en `--platform ios`.
- [x] `make android-build-emulator` : prebuild `--no-clean --platform android` puis `expo run:android` (« Pilbo Dev », Debug).
- [x] `make android-build-device` : idem sur `ANDROID_DEVICE_ID` (vérification `check-android-device-id`).
- [x] `make android-build-release` : voir étape 8.
- [x] `make help` à jour.
- [x] L'app démarre sur l'émulateur Android 17 (données de test, onboarding passé).

## Étape 8 — Signature Release

- [x] Générer le keystore (`keytool`), hors du repo. Chemin, alias et mots de passe dans `.env`.
- [x] Plugin de config (ex. `plugins/withReleaseSigning.js`) : `signingConfigs.release` lu depuis les variables d'environnement, survit à `prebuild --clean`. Erreur claire si une variable manque.
- [x] `make android-build-release` : « Pilbo » en Release, APK signé, installé sur `ANDROID_DEVICE_ID`, chemin de l'APK affiché.
- [x] `docs/android_build.md` : génération, ce qu'il faut sauvegarder (keystore + mots de passe) et où, restauration après un `git clone` ou sur une nouvelle machine, conséquence d'une perte (désinstallation, perte des données).
- [x] Tu sauvegardes le keystore et les mots de passe.

## Étape 9 — Composants Android

- Sélecteur d'heure :
  - [x] `IntakeTimeRow.tsx` → `IntakeTimeRow.ios.tsx` (inchangé).
  - [x] `IntakeTimeRow.android.tsx` : bouton (heure formatée par `formatIntakeTime`, même `accessibilityLabel`) qui ouvre le dialogue d'horloge Material. Lib : `@expo/ui/jetpack-compose` si elle propose le dialogue, sinon `@react-native-community/datetimepicker` (compatible Expo SDK 57). Format 12 h / 24 h du système.
  - [x] Cible tactile ≥ 44 pt, rôle `button`.
- Menu d'actions :
  - [x] `useMedRowActionSheet.ts` → `useMedRowActionSheet.ios.ts`.
  - [x] `useMedRowActionSheet.android.ts` : `Alert.alert` (titre = médicament, Modifier le médicament / Retirer de la prise / Annuler), même signature.
- [x] Types partagés : TypeScript résout correctement les imports (fichier `.d.ts` ou type commun si nécessaire).
- Bouton retour :
  - [x] Vérifier que le retour Android sur une modale modifiée ouvre `DiscardChangesDialog` (`usePreventRemove`) et que `leaveWithoutConfirmation` fonctionne. Corriger si besoin.

## Étape 10 — Notifications Android

- [x] Canaux (ex. `src/features/notifications/notificationChannels.android.ts` + `.ios.ts` sans effet) : « Rappels de prise » (importance haute) et « Stock bas » (importance normale), son `beep.wav`, noms traduits (namespace `notifications`, `make i18n-extract`, traductions EN). Créés au démarrage et au changement de langue (`useReminderScheduling`).
- [x] `planReminders` / `planLowStockAlerts` : canal de chaque notification. `resetReminders` : `channelId` dans le trigger.
- [x] Permission : parcours onboarding et réglages identique à iOS (popup Android 13+, `Linking.openSettings` si refusée).
- [x] Badge : `setBadgeCountAsync` sans erreur sur Android (pas d'effort si non affiché).
- [x] `docs/notifications.md` : section Android (canaux, alarmes exactes, permissions, redémarrage).

## Étape 11 — Affichage

- Écran par écran sur l'émulateur (petit écran) puis sur le S9 :
  - [x] Bord à bord : barre d'état, barre de navigation Android (gestes et 3 boutons), zones de sécurité.
  - [x] Clavier : champs visibles (`TextField`, `Sheet`, écran de stock).
  - [x] Ombres, polices, hauteurs de ligne, troncatures.
  - [x] Mode sombre et thème choisi dans l'app.
  - [x] Corrections via fichiers `.android` ou styles partagés sans effet sur iOS.

## Étape 12 — Tests

- [x] Jest : projets `ios` (suite existante, preset `jest-expo/ios`) et `android` (preset `jest-expo/android`, uniquement `*.android.spec.ts(x)`). Vérifier que `make tests` lance les deux.
- [x] `IntakeTimeRow.android.spec.tsx` : affichage de l'heure, `onChange` après choix dans le dialogue.
- [x] `useMedRowActionSheet.android.spec.ts` : chaque bouton appelle la bonne action.
- [x] `notificationChannels.android.spec.ts` : création des deux canaux.
- [x] Maestro (partiel, QA manuelle pour le reste) : `make android-test-e2e`, attente du premier écran à 60 s, défilement dans `intake-edit`. Passent sur Android : `calendar`, `intake-log-edit`, `language`, `low-stock-notice`, `meds-archive`, `meds-other-takings`, `today`. Non adaptés : sélecteur d'heure d'`intake-edit` ; non lancés : les autres.
- ~~`make test-e2e` (iOS) et `make android-test-e2e` passent.~~ Non lancés : QA manuelle.
- [x] `make tests` passe.

## Étape 13 — Vérification sur le Samsung Galaxy S9 (ROM Android 13 vue comme un SM-N985F par adb)

- [ ] Tu vérifies : APK Release installé, onboarding et popup de permission.
- [ ] Tu vérifies : rappel à l'heure, app fermée, écran éteint, son `beep.wav`, canal « Rappels de prise » en bannière.
- [ ] Tu vérifies : alerte de stock bas à 9h (canal « Stock bas »).
- [ ] Tu vérifies : rappels toujours là après redémarrage du téléphone.
- [ ] Tu vérifies : une nuit app fermée (économie d'énergie Samsung). Si des rappels sont bloqués, on en reparle avant de changer quoi que ce soit.
- [ ] Tu vérifies : TalkBack sur tous les écrans, taille de police maximale, réduction des animations.
- [ ] Tu vérifies : mise à jour de l'APK par-dessus l'ancien sans perte de données.
- [ ] Tu vérifies sur l'iPhone : rien n'a changé.

## Étape 14 — Fin

- [x] `docs/android_build.md` complet (environnement, commandes, signature, appareil, Maestro).
- [x] `make tests` passe.
- [x] Proposer la mise à jour de `CLAUDE.md` (Android n'est plus hors périmètre, stack, commandes `android-*`, règle des fichiers `.ios` / `.android`, couleurs) et des docs si besoin (après ta validation seulement).
