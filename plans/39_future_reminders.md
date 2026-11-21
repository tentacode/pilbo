# Spec 39 — Rappels planifiés sur plusieurs jours

## Contexte

Aujourd'hui, seuls les rappels d'aujourd'hui et de demain sont planifiés. Désormais, on planifie jour après jour jusqu'à remplir les 63 emplacements (ou jusqu'à un an), avec les alertes de stock bas dans l'ordre chronologique et l'avertissement « ouvrez l'app » après le dernier rappel. Spec et décisions : `specs/39_future_reminders.md`.

À lire avant de commencer : `CLAUDE.md`, `docs/architecture.md`, `docs/notifications.md` (sections « Principe », « Calcul des rappels », « Avertissement ouvrez l'app »).

Fichiers concernés : `src/features/notifications/rescheduleReminders.ts`, `src/features/notifications/utils/planReminders.ts`, `src/features/notifications/utils/planReopenAppWarning.ts`, `src/features/today/queries/getIntakesOfDay.ts`, `src/domain/recurrence.ts` (`isIntakeDueOn`), `src/config/notifications.ts`, et leurs tests.

## Étape 1 — Lecture unique des prises

- Dans `src/features/today/queries/getIntakesOfDay.ts` :
  - [x] Extraire une requête exportée (ex. `getIntakeVersionsOn(database, date)`), qui renvoie les versions valides ce jour-là (filtre `created_on` / `archived_on`, jointure sur les médicaments) sans le filtre `isIntakeDueOn`.
  - [x] `getIntakesOfDay` l'appelle, puis filtre avec `isIntakeDueOn`. Son comportement ne change pas.
- [x] Test dans `getIntakesOfDay.spec.ts` : `getIntakeVersionsOn` renvoie aussi une prise qui n'est pas prévue ce jour-là (semaine en pause, prise mensuelle), mais pas une version archivée ni une prise sans médicament.

## Étape 2 — Prises par jour

- Nouvelle fonction pure `src/features/notifications/utils/planIntakeDays.ts` (+ `planIntakeDays.spec.ts`) :
  - [x] Type `IntakeDay = { day: Date; intakes: Intake[] }`, exporté (utilisé par `planReminders`).
  - [x] `planIntakeDays(intakes, now)` : un élément par jour, d'aujourd'hui jusqu'au même jour un an plus tard inclus (dates locales via `addDays`, pas de calcul en millisecondes). Les prises sont filtrées avec `isIntakeDueOn`, et les jours sans prise sont omis.
  - [x] Tests : aujourd'hui en premier, semaine en pause omise, prise mensuelle dans 3 semaines, prise tous les 6 mois (deux occurrences dans l'horizon), borne d'un an incluse, 29 février, changement d'heure.

## Étape 3 — `planReminders`

- Dans `src/features/notifications/utils/planReminders.ts` :
  - [x] Options : `intakeDays: IntakeDay[]` (aujourd'hui en premier) à la place de `todayIntakes` / `tomorrowIntakes`. `todayLogs`, `lowStockAlerts` et `now` ne changent pas.
  - [x] Aujourd'hui (le premier élément, s'il tombe le jour de `now`) : prises sans log, seulement les rappels encore à venir, un par un.
  - [x] Jours suivants : un bloc de 6 rappels par prise (`planDayReminders`, badge du jour inchangé).
  - [x] Fusion chronologique des rappels d'aujourd'hui, des alertes de stock bas et des blocs (un bloc est daté par son premier rappel, ordre stable à égalité). On ajoute tant que ça rentre dans `MAXIMUM_SCHEDULED_REMINDERS`, et on s'arrête au premier élément qui ne rentre plus (point d'arrêt, voir la spec).
  - [x] Les alertes de stock bas après l'horizon d'un an sont ignorées.
- Tests dans `planReminders.spec.ts`, adaptés à la nouvelle signature :
  - [x] Une prise par jour : 10 jours planifiés (60 rappels).
  - [x] Plafond de 63 respecté, arrêt au premier bloc qui ne rentre plus.
  - [x] Prise mensuelle dans 3 semaines planifiée.
  - [x] Alertes de stock bas dans l'ordre chronologique : une alerte dans la période est planifiée, une alerte après le point d'arrêt ne l'est pas, une alerte peut faire sortir le dernier bloc.
  - [x] Badge calculé par jour (prises en attente de ce jour-là).
  - [x] Rappels sur deux jours séparés par un changement d'heure : heures locales justes.
  - [x] Les cas existants (rappels restants d'une prise commencée, prise déjà validée, identifiants, groupes, sons, canaux) passent toujours.

## Étape 4 — `rescheduleReminders` et avertissement

- Dans `src/features/notifications/rescheduleReminders.ts` :
  - [x] Lire les prises une seule fois (`getIntakeVersionsOn(database, now)`, triées avec `sortIntakeMeds`), puis `planIntakeDays(intakes, now)`.
  - [x] Passer `intakeDays` à `planReminders`. Retirer la lecture de demain.
- [x] `planReopenAppWarning` : vérifier qu'il suit le dernier rappel de prise planifié, quel que soit le jour (sans doute aucun changement de code).
- Tests dans `rescheduleReminders.spec.ts` :
  - [x] Mettre à jour les nombres et l'ordre attendus avec les données de test (plusieurs jours, alertes de stock bas à leur place chronologique).
  - [x] Récurrence : semaine en pause sans rappel, prise mensuelle planifiée plus tard.
  - [x] Avertissement 5 min après le dernier rappel du dernier jour planifié.
- [x] Vérifier les autres tests qui comptent les rappels planifiés (`reminderActionHandling.spec.ts`, `applyReminderAction.spec.ts`, `useReminderScheduling.spec.ts`…).

## Étape 5 — Documentation

- Dans `docs/notifications.md` :
  - [x] Section « Principe », point 3 : lecture unique des prises, puis filtre par jour.
  - [x] Section « Calcul des rappels » : remplacer « Demain » par les jours suivants (horizon d'un an, blocs de 6, point d'arrêt), et décrire les alertes de stock bas dans l'ordre chronologique.
  - [x] Section « Avertissement ouvrez l'app » : après le dernier rappel de prise planifié, quel que soit le jour.
  - [x] Section « Contraintes iOS » : remplacer « 4 prises × 6 rappels × 2 jours = 48 ».
  - [x] Ajouter `planIntakeDays.ts` au tableau « Fichiers ».

## Étape 6 — Vérification sur l'émulateur Android

Voir `docs/android_build.md` et les contraintes Android de `CLAUDE.md` (exporter `ANDROID_HOME` et `JAVA_HOME`, note sur `INTERNET` avant un build « Pilbo Dev »).

- [x] `make android-build-emulator`, autoriser les notifications, ouvrir l'app (replanification).
- [x] `adb shell dumpsys alarm | grep -A1 com.tentacode.pilbo.dev` : relever le nombre d'alarmes et leurs dates.
- [x] Avec les données de test : le nombre d'alarmes correspond au calcul (≤ 64), les rappels vont au-delà de demain, les alertes de stock bas sont à leur place chronologique, et l'avertissement « ouvrez l'app » tombe 5 min après le dernier rappel.
- [x] Après « Supprimer les données » (section debug), créer une seule prise quotidienne : 10 jours de rappels (60 alarmes) + l'avertissement.

## Étape 7 — Fin

- [x] `make tests` passe.
- [x] Proposer une mise à jour de `CLAUDE.md` / docs si besoin (après ta validation seulement).
