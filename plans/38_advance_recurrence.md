# Spec 38 — Récurrence avancée

## Contexte

Remplacer « Tous les jours / Certains jours » par « Tous les jours / Personnalisé ». La récurrence personnalisée se règle sur un nouvel écran « Quand prendre mes médicaments » : rythme Jour, Semaine (1 semaine sur N) ou Mois (1 mois sur N), avec une date de début. Toute l'app suit la récurrence. Spec et décisions : `specs/38_advance_recurrence.md`.

À lire avant de commencer : `CLAUDE.md`, `docs/architecture.md`, `docs/database.md`, `docs/notifications.md`. Design : écrans « Pilulier · Quand prendre, une semaine sur deux / une fois par mois / choix de la date » (lien dans la spec ; fichiers `project/when-weekly.dc.html`, `project/when-monthly.dc.html`, `project/when-date.dc.html` de l'artifact Claude Design, à lire avec l'outil Artifact).

## Étape 1 — Domaine : type et fonctions pures

- Dans `src/domain/intake.ts` :
  - [x] Type `IntakeFrequency` (`"daily" | "weekly" | "monthly"`), constantes des intervalles proposés (semaine : 2, 3, 4 ; mois : 1, 2, 3, 6).
  - [x] Ajouter à `Intake` : `frequency`, `interval`, `startsOn` (date locale `"2026-11-02"`).
  - [x] `isEveryDay(intake)` : `daily` + 7 jours (sert au choix « Tous les jours » / « Personnalisé »).
- Nouveau `src/domain/recurrence.ts` (+ `recurrence.spec.ts`), fonctions pures :
  - [x] `isIntakeDueOn(intake, date)` : faux avant `startsOn`. `daily` : jour de la semaine dans `days`. `weekly` : semaines du lundi au dimanche, comptées depuis la semaine qui contient `startsOn`, active si (écart en semaines) % `interval` = 0, et jour dans `days`. `monthly` : jour du mois de `startsOn`, ramené au dernier jour du mois s'il est plus court, et (écart en mois) % `interval` = 0.
  - [x] `nextDueDate(intake, from, isHandledToday)` : aujourd'hui si prévue et pas encore validée, sinon la prochaine date (recherche bornée).
  - [x] `nextDueDates(intake, from, count)` (liste « Prochaines prises » du rythme Mois).
  - [x] Tests : fins de mois (31 → 30 / 28 / 29 février), passage d'année, semaine de début partielle, 1 sur 3 / 1 sur 4, mois 1 sur 6, changement d'heure (dates locales, pas de calcul en millisecondes).
- [x] Remplacer les usages de `days.includes(weekdayOf(...))` par `isIntakeDueOn` (voir étapes 4 et 5).

## Étape 2 — Base de données

- [x] `src/shared/database/schema.ts` : `frequency` (text, `$type<IntakeFrequency>()`, défaut `"daily"`), `interval` (integer, défaut 1), `startsOn` (`starts_on`, text, obligatoire).
- [x] Vérifier si la dernière migration (`0002_intake_sound.sql`) a déjà été livrée (TestFlight / Play Store) : si oui, nouvelle migration « en cours » ; sinon, la régénérer avec ces colonnes (règle des migrations dans `CLAUDE.md` et `docs/database.md`).
- [x] `make db-generate`, relire le SQL. Les prises existantes deviennent `daily`, avec `interval` à 1 et `starts_on` = `created_on` (`UPDATE` ajouté au SQL si drizzle ne peut pas le faire avec un défaut).
- [x] Test de migration : une base avec des prises existantes garde ses données et reçoit les bonnes valeurs.
- [x] Lectures : ajouter les colonnes (alias `frequency`, `interval`, `startsOn`) dans `features/pillbox/queries/intakeRecord.ts`, `getAllIntakes.ts`, `getIntakeById.ts`, `features/calendar/queries/getMonthHistory.ts` (+ `IntakeVersion` dans `calendarTypes.ts`).
- [x] `features/today/queries/getIntakesOfDay.ts` : garder le filtre SQL de version (`created_on` / `archived_on`), retirer le filtre `json_each` et filtrer en TypeScript avec `isIntakeDueOn`.
- [x] `saveIntake.ts` : écrire les nouvelles colonnes. `scheduleSignature` inclut `frequency`, `interval`, `startsOn` (nouvelle version si la récurrence change et qu'il y a un historique). La nouvelle version garde `starts_on`.
- [x] Mettre à jour les tests des requêtes (`getAllIntakes.spec.ts`, `getIntakeById.spec.ts`, `getIntakesOfDay`, `saveIntake.spec.ts`, `getMonthHistory`).
- [x] Section **Schéma** de `docs/database.md` : nouvelles colonnes, migration, règle « prise prévue un jour D » (avec `isIntakeDueOn`, à reproduire en Swift pour le widget).

## Étape 3 — Brouillon de prise et textes

- `features/pillbox/utils/intakeDraft.ts` (+ spec) :
  - [x] `DayMode` devient `"everyDay" | "custom"`. Le brouillon porte `frequency`, `interval`, `startsOn`, `days`.
  - [x] Passage en `custom` depuis `everyDay` : `daily`, tous les jours cochés, `startsOn` = aujourd'hui (ou la valeur existante pour une prise enregistrée).
  - [x] Retour à `everyDay` : `daily`, 7 jours, `interval` 1.
  - [x] Changement de rythme : valeurs par défaut cohérentes (Semaine → `interval` 2 ; Mois → `interval` 1).
  - [x] `draftSignature` et `toIntakeToSave` incluent la récurrence.
- [x] `useIntakeDraft.tsx` : setters (`setDayMode`, `setFrequency`, `setInterval`, `setStartsOn`, `toggleDay`).
- [x] `utils/validators.ts` : aucun jour coché en Jour ou Semaine → erreur existante.
- `features/pillbox/utils/formatters.ts` (+ spec, FR et EN) :
  - [x] `formatRecurrence` : « Tous les jours », « Lundi, mercredi et vendredi », « Lundi, mercredi et vendredi, une semaine sur deux », « Le 2 de chaque mois », « Le 2, un mois sur deux »…
  - [x] `formatNextIntake` : « Prochaine : aujourd'hui / demain / mercredi 2 décembre ».
  - [x] `formatStartsOn` (« À partir d'aujourd'hui, lundi 2 novembre », « Aujourd'hui, 2 nov. »).
  - [x] Remplacer `formatIntakeDays` dans `formatIntakeSchedule` et `formatIntakeAccessibilityLabel`.
- [x] Textes via `t` (namespace `pillbox`), `make i18n-extract`, traductions EN.

## Étape 4 — Modale Prise et écran « Quand prendre mes médicaments »

- Modale Prise (`IntakeEditScreen.tsx`) :
  - [x] `IntakeDaysField` : segmenté « Tous les jours | Personnalisé », ronds retirés. En Personnalisé, une ligne (résumé + « Prochaine : … » + chevron, rôle bouton, libellé accessible complet) qui ouvre l'écran.
  - [x] Appui sur « Personnalisé » : ouvre directement l'écran « Quand prendre ».
- Écran « Quand prendre » : route `src/app/intake/recurrence.tsx` (empilée comme `intake/sound`), écran `features/pillbox/IntakeRecurrenceScreen.tsx` (+ spec), retour « Prise de 20:30 », pas de bouton Enregistrer.
  - [x] Encadré récapitulatif (`accessibilityLiveRegion` / rôle adapté), fixé en bas de l'écran (pied de la `Sheet`) pour que le contenu ne bouge pas quand le résumé passe à la ligne.
  - [x] Segmenté « Jour / Semaine / Mois ».
  - [x] Ronds Lu…Di (réutiliser `DayButton` et la mise en ligne de `IntakeDaysField`, deux lignes quand la place manque).
  - [x] Semaine : segmenté « 1 sur 2 / 1 sur 3 / 1 sur 4 » (libellés accessibles « Une semaine sur deux »…), aide « Les semaines se comptent à partir de cette date. », aperçu 4 semaines (composant dédié, masqué aux lecteurs d'écran, libellé de groupe complet).
  - [x] Mois : aide « Puis le 2 de chaque mois. » (+ phrase des 29 / 30 / 31), segmenté « Tous / 1 sur 2 / 1 sur 3 / 1 sur 6 », liste « Prochaines prises » (4 dates, étiquette « Aujourd'hui »).
  - [x] Ligne « À partir du » + calendrier maison dépliable (`aria-expanded` → `accessibilityState.expanded`). Réutiliser la grille de `features/calendar` (`monthGrid.ts`, `CalendarWeekdays`), mois précédent / suivant, jours passés grisés et désactivés, cases ≥ 44 pt, jour choisi `selected`. Une date passée existante reste affichée.
- [x] Tokens uniquement, couleurs du thème, Dynamic Type et iPhone 12 mini (`useFitsInWidth` si besoin), animation du dépliage coupée si « Réduire les animations ».
- [x] Tests RNTL : bascule Tous les jours / Personnalisé, chaque rythme, choix de date, retour qui applique au brouillon, abandon de la modale (`DiscardChangesDialog`) qui ignore la récurrence.

## Étape 5 — Écrans qui suivent la récurrence

- [x] Écran Pilulier, `IntakeCard` : en Personnalisé, résumé puis « Prochaine : … », sans intervalle de rappel. « Tous les jours » inchangé. La prochaine prise tient compte des logs du jour (`usePillboxData`).
- [x] Écran Aujourd'hui et notifications : via `getIntakesOfDay` (étape 2). Vérifier `planReminders`, `rescheduleReminders`, `applyReminderAction`, `getUpcomingIntake` et leurs tests (prise en semaine de pause, prise mensuelle demain).
- [x] Stocks : `features/stocks/utils/stockForecast.ts`. `dosesOn` utilise `isIntakeDueOn`. Le saut de semaines entières devient un saut sur une période qui se répète (ou simulation jour par jour, bornée), avec un résultat exact. Tests avec des prises 1 semaine sur 2 et mensuelles.
- [x] Modale Stock (`StockEditScreen`, `formatMedSchedule` dans `features/stocks/utils/formatters.ts`, `medSchedule.ts`), ligne sous le nom : règles de la spec (« 1 prise à 08:00 », résumé à la ligne en Personnalisé, « X prises »). `StockEditHeader` accepte deux lignes. Tests FR / EN.
- [x] Écran détail Médicament, `MedIntakesSection` : résumé de la récurrence à la place des jours.
- [x] Calendrier, `monthGrid.ts` : statuts calculés avec `isIntakeDueOn` (une semaine en pause n'est pas un oubli), sans changement d'interface. Tests.
- [x] `features/today/utils/testIntakes.ts` et autres fabriques de test : nouveaux champs.

## Étape 6 — Données de test et e2e

- [x] `src/shared/database/fixtures.ts` : une prise mensuelle et une prise une semaine sur deux, avec historique cohérent (logs seulement les jours prévus).
- [x] Nouveau flow Maestro `e2e/intake-recurrence.yaml` : créer une prise « 1 semaine sur 2 » et une « chaque mois », vérifier le résumé et la prochaine prise sur l'écran Pilulier. Adapter `e2e/intake-edit.yaml` et `e2e/pillbox.yaml` si les textes « Certains jours » y sont utilisés.
- [x] `make test-e2e` passe sur le simulateur iOS.

## Étape 7 — Fin

- [ ] Vérifier sur le simulateur iOS : modale Prise, écran « Quand prendre » (trois rythmes, calendrier), écran Pilulier, modale Stock, Dynamic Type au maximum, VoiceOver.
- [x] `make tests` passe.
- [x] Mettre à jour `docs/database.md` (étape 2) et `docs/notifications.md` si besoin (prises prévues via `isIntakeDueOn`).
- [ ] Proposer une mise à jour de `CLAUDE.md` / docs si besoin (après ta validation seulement), ex. note pour le widget : la règle `isIntakeDueOn` à reproduire en Swift.
