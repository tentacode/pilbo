# Spec 31 — Plusieurs sons de notification

## Contexte

On peut choisir le son des rappels pour chaque prise, avec un son par défaut dans les réglages, et le son des alertes de stock bas. Huit sons plus « Vibration seule », à écouter dans un écran de choix avant de valider. Spec et décisions : `specs/31_multiple_sounds.md`.

Fichiers concernés :

- Sons : `assets/sounds/`, `scripts/generateSounds.mjs`, `Makefile`, `app.config.ts` (plugin `expo-notifications` → `sounds`)
- Base : `src/shared/database/schema.ts`, `src/shared/database/migrations/`, `src/domain/intake.ts`
- Prises : `src/features/pillbox/queries/` (`intakeRecord.ts`, `saveIntake.ts`), `utils/intakeDraft.ts`, `hooks/useIntakeDraft.tsx`, `IntakeEditScreen.tsx`, `components/ReminderIntervalField.tsx` (modèle de champ)
- Réglages : `src/features/settings/store/settingsStore.ts`, `SettingsScreen.tsx`, `components/DefaultIntervalRow.tsx`, `components/LowStockRow.tsx`, `components/SettingsRow.tsx`
- Notifications : `src/config/notifications.ts`, `src/features/notifications/` (`notifications.ts`, `notificationChannels.*`, `rescheduleReminders.ts`, `hooks/useReminderScheduling.ts`, `utils/planReminders.ts`, `utils/planLowStockAlerts.ts`)
- Navigation : `src/app/_layout.tsx`, `src/app/intake/`
- Docs : `docs/notifications.md`, `docs/database.md`, `docs/architecture.md`

## Étape 1 — Vérifier « Vibration seule » sur l'iPhone

- [x] Ajouter `generateSilence()` dans `scripts/generateSounds.mjs` : `silence.wav`, environ 0,5 s de silence.
- [x] Retirer `generateGentleAlert("gentle_alert", …)` du script (garder `gentle_alert_resolved`).
- [x] Cible `make sounds` dans le `Makefile` (`## Generate the notification sounds`, à côté de `artwork`), l'ajouter à `.PHONY`. Lancer `make sounds`.
- [x] Déclarer temporairement `./assets/sounds/silence.wav` dans `app.config.ts` et planifier une notification de test avec `sound: "silence.wav"` (ex. depuis la section debug), puis `make build-device`.
- [x] Tu vérifies sur l'iPhone, app fermée : la notification vibre, en mode sonnerie et en mode silencieux (selon les réglages haptiques).
- [x] Retirer le code de test. Noter le résultat dans les décisions de la spec : « Vibration seule » sur les deux plateformes, ou sur Android uniquement.

Je m'arrête et j'attends ta validation.

## Étape 2 — Liste des sons (domaine)

- [x] `src/domain/sound.ts` :
  - type `NotificationSound` (clés : `beep_short`, `beep`, `chime`, `drop`, `pill_rattle`, `gentle_alert_resolved`, `nocturne`, `shire`, `vibration`) ;
  - `NOTIFICATION_SOUNDS` dans l'ordre de la spec ;
  - `DEFAULT_NOTIFICATION_SOUND = "beep"` ;
  - `soundFileOf(sound)` : `"<clé>.wav"`, `"silence.wav"` pour `vibration` ;
  - `isNotificationSound(value)` pour relire une valeur inconnue (repli sur `beep`).
- [x] (Sans objet : l'étape 1 a réussi.) Si l'étape 1 a échoué : liste propre à chaque plateforme (`NOTIFICATION_SOUNDS` dans des fichiers `.ios.ts` / `.android.ts` + contrat `.d.ts`, sans `Platform.OS`), sans `vibration` sur iOS.
- [x] Nom traduit : `formatSoundName(t: TFunction<"notifications">, sound)` dans `src/features/notifications/utils/formatters.ts` (noms du tableau de la spec).
- [x] Tests Jest : `src/domain/sound.spec.ts`, `formatters.spec.ts` (FR et EN).
- [x] `app.config.ts` : déclarer tous les fichiers (`NOTIFICATION_SOUNDS` → `soundFileOf`, ou la liste en dur si l'import n'est pas possible dans la config).

## Étape 3 — Base de données

- [x] Vérifier avec toi si `0001_meds_archive` a été envoyée sur TestFlight (règle des migrations, `docs/database.md`) : la régénérer avec la nouvelle colonne si elle est encore « en cours », sinon en créer une nouvelle. → Nouvelle migration par précaution : `0002_intake_sound`.
- [x] `schema.ts` : `sound: text("sound").$type<NotificationSound>().notNull().default("beep")` sur `intakeTable`.
- [x] `make db-generate`, relire le SQL (les prises existantes passent à `beep`).
- [x] `Intake` (`src/domain/intake.ts`) : champ `sound: NotificationSound`.
- [x] `selectActiveIntakes` (`queries/intakeRecord.ts`) et `getIntakesOfDay` (`features/today/queries/`) : lire `${intakeTable.sound} AS sound`, valeur inconnue → `beep` (`toNotificationSound`).
- [x] `saveIntake` : écrire `sound`. Le son ne fait pas partie de `scheduleSignature` : modification sur place, pas de nouvelle version.
- [x] Nouvelles requêtes dans `src/features/pillbox/queries/` :
  - `hasActiveIntakeWithOtherSound(database, sound)` ;
  - `setAllActiveIntakesSound(database, sound)` (mise à jour sur place des prises non archivées, condition en `sql`).
- [x] Tests Jest : `getAllIntakes.spec.ts` / `getIntakeById.spec.ts` (son lu), `saveIntake.spec.ts` (changement de son seul → pas de nouvelle version, même avec des logs passés), specs des deux nouvelles requêtes.
- [x] Mettre à jour les fixtures si besoin (`fixtures.ts`), par exemple une prise avec un autre son.
- [x] Mettre à jour la section Schéma de `docs/database.md` (colonne `sound`, modification sur place).

## Étape 4 — Réglages persistés

- [x] `settingsStore.ts` : `defaultReminderSound` et `lowStockSound` (`DEFAULT_NOTIFICATION_SOUND`), setters, `partialize`. Ancien format sans ces clés → valeurs par défaut.
- [x] Tests dans `settingsStore.spec.ts`.

## Étape 5 — Notifications

- [x] `PlannedReminder` : champ `sound: NotificationSound`.
- [x] `planReminders` : son de la prise. `planLowStockAlerts(stockItems, now, sound)` : son des alertes.
- [x] `resetReminders` : `sound: soundFileOf(sound)` au lieu de `"beep.wav"`.
- [x] Canaux Android :
  - `src/config/notifications.ts` : `reminderChannelId(sound)` / `lowStockChannelId(sound)` (`intake-reminders` et `low-stock` pour `beep`, sinon suffixe `-<clé>`). Mettre à jour le commentaire.
  - `PlannedReminder.channelId` : identifiant calculé selon le son.
  - `setUpNotificationChannels(usedSounds)` (`.android.ts`, `.ios.ts`, `.d.ts`) : crée les canaux des sons utilisés, nom « Rappels de prise – <son> » / « Stock bas – <son> » ; `vibration` sans son, vibration activée. Supprime les canaux Pilbo existants qui ne sont plus utilisés (`getNotificationChannelsAsync` + `deleteNotificationChannelAsync`).
  - Au moins le canal de rappel du son par défaut existe toujours (permission Android 13+).
- [x] `rescheduleReminders(database, now, settings)` : reçoit `lowStockSound` en paramètre, calcule les sons utilisés (prises du jour et du lendemain, alertes), appelle `setUpNotificationChannels`, puis `resetReminders`. `useReminderScheduling` passe les réglages et n'appelle plus `setUpNotificationChannels` seul. Vérifier les autres appelants de `rescheduleReminders`. → Finalement, `rescheduleReminders(database, now)` lit les sons dans `useSettingsStore.getState()` (7 appelants inchangés), crée les canaux avant le test de permission, et garde les canaux des sons de toutes les prises actives (canaux stables d'un jour à l'autre).
- [x] Tests Jest : `planReminders.spec.ts`, `planLowStockAlerts.spec.ts`, `rescheduleReminders.spec.ts`, `notificationChannels.android.spec.ts` (création, suppression, `vibration`), `useReminderScheduling.spec.ts`.
- [x] i18n `notifications` : noms des sons et des canaux, `make i18n-extract`, traductions EN.

## Étape 6 — Écran de choix du son

- [x] `pnpm expo install expo-audio`. Ajouter le plugin dans `app.config.ts` si nécessaire.
- [x] Hook `useSoundPreview()` (`src/features/notifications/hooks/`) :
  - mode audio : joue en mode silencieux (`playsInSilentMode`), baisse la musique en cours sans la couper ;
  - `play(sound)` : coupe le son en cours et joue le nouveau ; `vibration` → vibration du téléphone ;
  - arrêt quand l'écran est quitté.
- [x] Composant `SoundOption` (rangée radio : nom, coche, `accessibilityRole="radio"`, `accessibilityState={{ checked }}`, `accessibilityHint` d'écoute, cible ≥ 44 pt, tokens, `createThemedStyles`).
- [x] `SoundPickerScreen` (`src/features/notifications/SoundPickerScreen.tsx`) : `Sheet` avec un titre, « Annuler » (`router.back()`), bouton « Valider » en pied. Props : son initial et `onConfirm(sound)`. Un appui sur une rangée sélectionne et joue.
- [x] Tests : `SoundPickerScreen.spec.tsx` (sélection, Annuler garde l'ancien son, Valider renvoie le son choisi, état d'accessibilité), `useSoundPreview` mocké.

## Étape 7 — Son d'une prise

- [x] `IntakeDraft` : champ `sound`. `createIntakeDraft(defaultReminderIntervalMinutes, defaultReminderSound, intake?)`, `draftSignature` et `toIntakeToSave` incluent le son.
- [x] `useIntakeDraft` : `setSound`, son par défaut lu dans `useSettingsStore`.
- [x] Route `src/app/intake/sound.tsx` → écran qui branche `SoundPickerScreen` sur le brouillon (`setSound`, puis retour).
- [x] Composant `IntakeSoundField` (`src/features/pillbox/components/`) : ligne « Son » avec le nom du son, ouvre `/intake/sound`. Placé sous `ReminderIntervalField` dans `IntakeEditScreen`.
- [x] Tests : `intakeDraft.spec.ts`, `IntakeEditScreen.spec.tsx` (son affiché, dirty après un changement, son enregistré).

## Étape 8 — Sons dans les réglages

- [x] Route modale `src/app/sound.tsx` (`presentation: "modal"` dans `app/_layout.tsx`), paramètre `kind` (`reminder` | `lowStock`).
- [x] `ReminderSoundRow` (section « Rappels », « Son par défaut ») et `LowStockSoundRow` (section « Stock », « Son des alertes ») : nom du son, ouvrent la modale.
- [x] Texte d'aide de la section « Rappels » adapté (son + intervalle).
- [x] Validation du son des alertes : `setLowStockSound`, replanification, retour.
- [x] Validation du son par défaut : `setDefaultReminderSound`. Si `hasActiveIntakeWithOtherSound` : `Dialog` « Toutes les prises » / « Nouvelles prises uniquement ». « Toutes les prises » → `setAllActiveIntakesSound`, puis replanification. Retour après le choix.
- [x] i18n `settings` : `make i18n-extract`, traductions EN. Ton de l'app (vouvoiement, phrases courtes).
- [x] Tests : specs des deux lignes, écran modal (avec et sans popup, les deux choix de la popup).

## Étape 9 — e2e Maestro

- [x] Nouveau flow `e2e/sounds.yaml` (ou ajout à `intake-edit.yaml` et `settings.yaml`) :
  - choisir un son sur une prise, enregistrer, rouvrir la prise : le son est retenu ;
  - Annuler dans l'écran de choix garde l'ancien son ;
  - changer le son par défaut dans les réglages, choisir « Toutes les prises » dans la popup, vérifier le son d'une prise.
- [x] `make test-e2e` passe, et `make android-test-e2e`. → iOS : 14/14 (`meds-archive` a échoué une fois, puis passe seul). Android : `sounds` passe ; échecs dans `settings`, `onboarding`, `meds`, `intake-edit` (flows listés comme pas encore adaptés à Android dans `docs/android_build.md`), `meds-other-takings` a échoué une fois puis passe seul.

## Étape 10 — Fin

- [x] `make tests` passe.
- [x] `docs/notifications.md` : sons (tableau Fichiers, contenu des rappels et des alertes, canaux Android par son, « Vibration seule », `make sounds`).
- [x] `docs/architecture.md` : modale `sound` dans la liste des modales.
- [ ] Tu vérifies sur l'iPhone et le Galaxy S9 (écoute vérifiée sur les deux, le reste à faire plus tard) :
  - écoute de chaque son (y compris en mode silencieux), musique en cours baissée puis rétablie ;
  - notifications d'une prise et d'une alerte de stock avec un son non par défaut, et « Vibration seule » ;
  - canaux Android dans les réglages du téléphone (`adb shell dumpsys notification | grep "NotificationChannel{" | grep pilbo`) ;
  - VoiceOver / TalkBack, grand texte (iPhone 12 mini).
- [x] Proposer une mise à jour de `CLAUDE.md` / docs si besoin (après ta validation seulement). → Ajout dans « Contraintes Android » : `INTERNET` retiré du manifeste après un build « Pilbo ».
