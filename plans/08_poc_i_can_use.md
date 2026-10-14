# Spec 08 — Proof of concept utilisable

## Contexte

Rendre l'app utilisable dans la vraie vie : historique des prises (`intake_log`), validation depuis l'écran « Aujourd'hui » (section « Plus tôt »), rappels planifiés toutes les 10 minutes jusqu'à la validation, badge. Spec et décisions : `specs/08_poc_i_can_use.md`.

À lire avant de commencer :

- `CLAUDE.md`, `docs/architecture.md`, `docs/database.md`, `docs/notifications.md`.
- Design (Claude Design) : `https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4`, artboards `project/today-undo.dc.html` (section « Plus tôt », carte « Ignorée »), `project/empty-today-done.dc.html` (« C'est tout pour aujourd'hui », cartes « Pris à… »), `project/today-edge.dc.html` (pastille « en retard »), styles `project/pilbo.css` (`.card.done`, `.card.skip`, `.compact`, `.strip`, `.names`, `.pst.ok`, `.pst.skip`, `.pst.late`, `.empty`). Lecture via l'outil Artifact, action `read` avec `path`.
- Code existant :
  - `src/shared/database/` : `schema.ts`, `fixtures.ts`, `seed.ts`, `clearDatabase.ts`, `testDatabase.ts`.
  - `src/features/today/` : `hooks/useTodayData.ts`, `queries/getTodayIntakes.ts`, `utils/computeTodayIntakes.ts`, `utils/formatters.ts`, `utils/todayTypes.ts`, `components/` (cartes, `TodayIntakeSections`, `TodayEmptyState`, `IntakeCardActions`).
  - `src/features/pillbox/queries/getAllIntakes.ts`.
  - `src/features/notifications/notifications.ts` (proof of concept de la spec 02, à reprendre).
  - `src/app/_layout.tsx`, `e2e/today.yaml`.

Tu peux enchaîner les étapes, mais pose des questions en cas de doute ou de changement de dernière minute.

## Étape 1 — Schéma : `intake_log` et `is_archived`

- `src/shared/database/schema.ts` :
  - [x] `intakeTable` : `isArchived: integer("is_archived", { mode: "boolean" }).notNull().default(false)`.
  - [x] `intakeLogTable` (`intake_log`) : `id` (UUID, `generateId`), `intakeId` (`intake_id`, `references(() => intakeTable.id, { onDelete: "restrict" })`), `expectedIntakeAt` (`expected_intake_at`, texte), `createdAt` (`created_at`, texte), `status` (texte, `$type<IntakeLogStatus>()`).
  - [x] Types `IntakeLogRow` / `NewIntakeLogRow` (`$inferSelect` / `$inferInsert`).
- [x] `src/domain/intakeLog.ts` : `IntakeLogStatus = "taken" | "skipped"`, `IntakeLog` (type métier), et fonctions pures de format de date locale : `toLocalDateTime(date): string` (`"2026-10-14T08:20"`), `toLocalDate(date): string` (`"2026-10-14"`), `fromLocalDateTime(text): Date`. Tests `intakeLog.spec.ts` (zéros devant, aller-retour).
- [x] `make db-generate` : migration générée, `migrations.js` à jour.
- [x] `src/shared/database/clearDatabase.ts` : supprimer `intake_log` en premier (FK `restrict`). Test mis à jour.
- [x] `docs/database.md` : section **Schéma** (`intake.is_archived`, table `intake_log`), format des dates en texte local dans **Subtilités**.
- [x] `make tests` passe.

## Étape 2 — Prises archivées exclues

- [x] `features/pillbox/queries/getAllIntakes.ts` et `features/today/queries/getTodayIntakes.ts` : `WHERE ${intakeTable.isArchived} = 0`.
- [x] Tests : une prise archivée n'apparaît dans aucune des deux requêtes.
- [x] `make tests` passe.

## Étape 3 — Fixture de log (dev)

- [x] `src/shared/database/fixtures.ts` : décrire le log de fixture (prise de 08:20, `taken`, `created_at` = heure prévue + 45 min, à la date du jour).
- [x] `src/shared/database/seed.ts` : insérer ce log seulement si `__DEV__` (dans la même transaction, après les prises). Rendre ce choix testable (ex. paramètre `{ withLogs }` de `seedDatabase`, `__DEV__` passé par l'appelant).
- [x] `seed.spec.ts` : log présent avec `withLogs`, absent sinon.
- [x] `make tests` passe.

## Étape 4 — Requêtes et écriture des logs

Dans `src/features/today/` :

- [x] `queries/getIntakeLogsOfDay(database, localDate)` : logs dont `expected_intake_at` commence par la date (`LIKE ${localDate} || '%'`), SQL brut, alias camelCase.
- [x] `queries/insertIntakeLog(database, { intakeId, expectedIntakeAt, status, createdAt })` : écriture Drizzle.
- [x] Tests `better-sqlite3` : filtre par jour (log de la veille absent), insertion relue, FK `restrict` (supprimer une prise avec log échoue).
- [x] `make tests` passe.

## Étape 5 — Calcul des états avec les logs

Fonctions pures, `now: Date` en paramètre.

- [x] `utils/todayTypes.ts` :
  - `IntakeStatus` étendu : `"taken" | "skipped"`.
  - `TodayIntake` : ajouter le log éventuel (heure de validation, `isTakenLate`).
  - `TodaySections` : ajouter `earlier: TodayIntake[]` (« Plus tôt »).
- [x] `utils/computeTodayIntakes.ts` : prend aussi les logs du jour.
  - Prise avec log → `earlier` (ordre par heure prévue).
  - `isTakenLate` : `taken` et `created_at` > heure prévue + `LATE_THRESHOLD_MINUTES`.
  - Prises sans log : règles actuelles (en retard / prochaine / plus tard).
- [x] `utils/formatters.ts` :
  - Statuts : « Pris à 09:05 », « Pris en retard à 09:05 », « Ignorée » (+ libellés VoiceOver).
  - Résumé de l'en-tête : premier nombre = pris + ignorées.
  - Ligne des noms de la carte compacte : « Lithium 250 mg · Lamictal 50 mg », « Lithium 250 mg (2 ×) » (cf. artboard).
- [x] Fonction « tout est traité » (aucune prise sans log, au moins une prise).
- [x] Tests avec une heure fixée : pris à l'heure, pris en retard (seuil 30 min), ignorée, mélange avec prises sans log, résumé, tout traité.
- [x] `make tests` passe.

## Étape 6 — Interface « Plus tôt » et « tout est traité »

- [x] Tokens manquants (`tokens.ts`) pour les cartes `done` / `skip` et pastilles `ok` / `skip`, contraste AA vérifié.
- [x] `components/EarlierIntakeCard.tsx` (+ styles) : carte compacte sans bouton, heure, pastille (pris : `ok` ; pris en retard : style `late`, icône d'alerte ; ignorée : `skip`), pilules (`strip`), ligne des noms. Groupe accessible avec un libellé complet.
- [x] Icônes manquantes dans `Icon` si besoin (cercle coché, cercle tiret).
- [x] `TodayIntakeSections.tsx` : section « Plus tôt » en dernier.
- [x] `components/TodayDoneState.tsx` (+ styles) : « C'est tout pour aujourd'hui », illustration de l'artboard, sans phrase « Prochaine prise demain ».
- [x] `TodayScreen.tsx` : état vide (aucune prise), tout traité (`TodayDoneState` + « Plus tôt »), sinon les sections.
- [x] Tests RNTL : `EarlierIntakeCard` (3 statuts, libellés), écran tout traité.
- [x] `make tests` passe.

## Étape 7 — Calcul des rappels (fonction pure)

Dans `src/features/notifications/` :

- [x] `src/config/notifications.ts` : `REMINDER_COUNT = 6`, `MINIMUM_DELAY_BEFORE_REMINDER_SECONDS = 60`, `MAXIMUM_SCHEDULED_REMINDERS = 64`.
- [x] `utils/planReminders.ts` : `planReminders({ todayIntakes, tomorrowIntakes, todayLogs, now }): PlannedReminder[]` (`identifier`, `date`, `title`, `body`, `badge`).
  - Aujourd'hui : prises sans log, rappels à `heure + n × reminderIntervalMinutes` (n de 0 à 5), seulement ceux à plus d'une minute de `now`.
  - Demain : ajouté prise par prise (ses 6 rappels entiers) tant que le total reste ≤ 64.
  - Badge d'un rappel : nombre de prises du même jour dont l'heure est ≤ heure du rappel et sans log.
  - Identifiant : `reminder-<intakeId>-<date locale>`.
  - Titre « C'est l'heure de votre prise de 08:20 », corps « 1 × Lithium 250 mg, 1 × Lamictal 50 mg ».
- [x] Tests avec une heure fixée : rappels restants d'une prise commencée (08:35 → 08:40…09:10), prise validée ignorée, délai d'une minute, plafond 64, badges, contenu.
- [x] `make tests` passe.

## Étape 8 — Planification iOS

- [x] `notifications.ts` (reprendre la proof of concept, garder `setNotificationHandler`) :
  - `requestPermission()` : renvoie l'état accordé.
  - `getPermissionGranted()` : lecture sans demander (`getPermissionsAsync`).
  - `resetReminders(plannedReminders)` : annule les planifiées, efface les affichées, badge à 0, puis planifie chaque rappel (`DATE`, `sound: "beep.wav"`, `interruptionLevel: "active"`, `badge`).
  - Retirer le code de la proof of concept devenu inutile (`scheduleReminders`, `clearReminders`…).
- [x] `rescheduleReminders(database, now)` : lit les prises du jour et de demain (`getTodayIntakes`, `weekdayOf`), les logs du jour, appelle `planReminders` puis `resetReminders`. Ne fait rien si la permission n'est pas accordée.
- [x] Hook `hooks/useReminderScheduling.ts` : demande la permission au lancement, puis `rescheduleReminders` au lancement et à chaque retour au premier plan (`AppState` → `active`). Monté dans `src/app/_layout.tsx` une fois la base prête.
- [x] `docs/notifications.md` : mettre à jour (principe, fichiers, config, badge, limite de 64 identique gratuit/payant, nettoyage complet).
- [x] `make tests` passe.

## Étape 9 — Valider une prise

- [x] Hook `features/today/hooks/useIntakeValidation.ts` : `validate(intakeId, status)`.
  - Garde l'identifiant en cours (bouton désactivé).
  - `insertIntakeLog` (date prévue = aujourd'hui à l'heure de la prise, `created_at` = maintenant).
  - Relit les données de l'écran.
  - `rescheduleReminders` : en cas d'échec, le log est gardé, erreur seulement en console.
  - Échec de l'écriture : bouton réactivé, erreur en console, aucun message.
- [x] `useTodayData.ts` : lit aussi les logs du jour, expose une fonction de relecture.
- [x] `TodayScreen.tsx` : `handleTake` / `handleSkip` branchés.
- [x] `IntakeCardActions` et `LaterIntakeCard` : prop `isDisabled`, transmise au `Button` (`disabled` + `accessibilityState`). Ajouter le support dans `Button` si absent (+ test).
- [x] Tests : hook (succès → log + relecture ; échec → bouton réactivé), écran (appui → la prise passe dans « Plus tôt »).
- [x] `make tests` passe.

## Étape 10 — Message « rappels désactivés »

- [x] `components/RemindersDisabledNotice.tsx` (+ styles) : « Les rappels sont désactivés », texte secondaire (ex. « Activez les notifications dans les Réglages pour recevoir vos rappels. »), bouton « Ouvrir les Réglages » (`Linking.openSettings()`).
- [x] Affiché sur « Aujourd'hui » sous l'en-tête si la permission n'est pas accordée (relu au focus et au retour au premier plan).
- [x] Test RNTL : rôle, libellé, `openSettings` appelé.
- [x] `make tests` passe.

## Étape 11 — Maestro

- [x] `e2e/today.yaml` (ou nouveau `e2e/today-validation.yaml`) : appuyer sur le bouton de prise de 22:00 (libellé d'accessibilité « Prendre la prise de 22:00 ») → la prise apparaît dans « Plus tôt ». Gérer la fenêtre de permission (refuser ou autoriser) au lancement.
- [x] Vérifier que `e2e/today.yaml` passe toujours (la prise de 08:20 est maintenant dans « Plus tôt » en dev).
- [x] `make test-e2e` passe.

## Étape 12 — Vérifications sur iPhone

- [ ] Tu vérifies sur le simulateur ou l'iPhone (`make build-device`) : « Plus tôt », pastilles, « tout est traité », message « rappels désactivés », VoiceOver, Dynamic Type.
- [ ] Tu vérifies sur l'iPhone : rappels toutes les 10 minutes app fermée, arrêt après « Je l'ai pris », badge, rien de recréé à moins d'une minute.
- [ ] Tu installes le build Release (`make build-release`) : autonome, sans log de fixture.

Je m'arrête et j'attends ta validation.

## Étape 13 — Fin

- [ ] `make tests` passe.
- [ ] Proposer une mise à jour de `CLAUDE.md` / docs si besoin (après ta validation seulement).
