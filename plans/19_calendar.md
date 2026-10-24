# Spec 19 — Calendrier

## Contexte

Historique des prises : navigation jour par jour depuis « Aujourd'hui », calendrier mensuel avec l'état de chaque jour, écran d'un jour passé en lecture seule. Les prises sont versionnées pour que le passé reste exact. Spec et décisions : `specs/19_calendar.md`.

À lire avant de commencer :

- `CLAUDE.md`, `docs/architecture.md`, `docs/database.md` (écrire une migration, requêtes, transactions).
- Design : artboard « Aujourd'hui · Calendrier (octobre) » (`project/calendar.dc.html`) dans https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4 (lecture avec l'outil Artifact, action `read` + `path`, styles dans `project/pilbo.css` : `.cal`, `.cd`, `.leg`). Les boutons d'accès du design sur « Aujourd'hui » ne sont pas repris.
- Code existant :
  - Base : `src/shared/database/schema.ts` (`intakeTable`), `fixtures.ts`, `seed.ts`, `testDatabase.ts`.
  - Prises : `src/domain/intake.ts`, `src/domain/intakeLog.ts` (`toLocalDate`, `fromLocalDateTime`), `src/features/pillbox/queries/saveIntake.ts`, `archiveIntake.ts`, `intakeRecord.ts` (`selectActiveIntakes`), `hooks/useIntakeActions.ts`.
  - Aujourd'hui : `src/features/today/TodayScreen.tsx`, `hooks/useTodayData.ts`, `queries/getTodayData.ts`, `getTodayIntakes.ts`, `getIntakeLogsOfDay.ts`, `getLastMedLogsOfDay.ts`, `utils/computeTodayIntakes.ts` (`LATE_THRESHOLD_MINUTES`, `weekdayOf`), `utils/formatters.ts`, `components/TodayHeader.tsx`, `EarlierIntakeCard.tsx`, `LateIntakeCard.tsx`, `AsNeededSection.tsx`.
  - Routes : `src/app/(tabs)/_layout.tsx`, `src/app/(tabs)/today.tsx`.
  - Design system : `Screen`, `IconButton`, `Icon` (`iconShapes.tsx` : `chevronLeft`, `chevronRight`, `check`, `clock`, `alert`, `minus`), `Text`, `useFitsInWidth`, `tokens.ts`.

# Arrêt 1 — Historique exact des prises

## Étape 1 — Colonnes `created_on` / `archived_on`

- [x] `schema.ts` : `intakeTable.createdOn` (texte, obligatoire) et `archivedOn` (texte, facultatif), dates locales `2026-10-24`.
- [x] `make db-generate`, relire le SQL généré. Pas de migration de données.
- [x] `docs/database.md` : section Schéma (`intake`), règle des versions.

## Étape 2 — Versionnage à l'enregistrement et à l'archivage

- [x] `saveIntake(database, intake, today)` :
  - [x] Création : `createdOn` = aujourd'hui.
  - [x] Modification de l'heure, des jours, des médicaments ou des quantités, avec des logs avant aujourd'hui : dans une transaction, ancienne version archivée (`isArchived`, `archivedOn` = aujourd'hui), nouvelle version créée (`createdOn` = aujourd'hui), logs du jour déplacés sur la nouvelle version. Renvoie le nouvel `id`.
  - [x] Sinon (pas de log passé, ou seulement l'intervalle de rappel modifié) : modification sur place.
- [x] `archiveIntake` : `archivedOn` = aujourd'hui.
- [x] Appelants à jour (`useIntakeActions`, onboarding si concerné).
- [x] Tests : création, modification sans log passé, avec log passé (deux versions, logs du jour déplacés), intervalle seul, archivage.

## Étape 3 — Prises prévues d'un jour

- [x] Requête (ex. `features/today/queries/getIntakesOfDay.ts`) : versions avec `createdOn ≤ D`, `archivedOn` nul ou `> D`, jour de la semaine dans `days`. Remplace `getTodayIntakes` pour aujourd'hui (même résultat : archivée aujourd'hui = absente).
- [x] `getTodayData` devient `getDayData(database, date)`.
- [x] Requête du premier jour d'historique (ex. `getFirstHistoryDate`) : plus petit `createdOn`, ou premier log.
- [x] Tests : prise créée après D, archivée avant D, archivée le jour D, deux versions, jours de la semaine.

## Étape 4 — Fixtures

- [x] Prises créées environ 45 jours avant aujourd'hui (`seed.ts` calcule les dates relativement à `now`).
- [x] Logs des jours passés : majorité pris, quelques retards, un jour tout ignoré, un oubli total, du hors planning (`med_log`). Aujourd'hui inchangé (e2e existants).
- [x] Une prise modifiée il y a environ 10 jours : deux versions.
- [x] Tests du seed à jour.

- [x] `make tests` passe.
- [x] Tu vérifies sur l'iPhone : « Réinitialiser avec des données de test », « Aujourd'hui » inchangé, modifier puis archiver une prise fonctionne comme avant.

Je m'arrête et j'attends ta validation.

# Arrêt 2 — Jour précédent / suivant

## Étape 5 — Routes

- [x] L'onglet « Aujourd'hui » devient une pile : `src/app/(tabs)/today/_layout.tsx` (Stack sans en-tête), `index.tsx`, `calendar.tsx`. Jour ouvert depuis le calendrier : modale racine `src/app/day/[date].tsx` (drawer). Barre d'onglets visible, onglet « Aujourd'hui » actif.
- [x] Liens existants vers `/today` vérifiés (notification, bandeau, onboarding).

## Étape 6 — Écran d'un jour

- [x] `TodayScreen` reçoit le jour affiché (state local sur l'onglet, paramètre `date` sur `day/[date]`).
- [x] Jour passé : `useDayData(date)` en lecture seule (pas de `useCurrentMinute`), statuts calculés en fin de journée.
- [x] Nouvelle carte « Non pris » (style « en retard », sans boutons, libellé accessible).
- [x] Prises prises ou ignorées : `EarlierIntakeCard` sans action.
- [x] Hors planning : médicaments pris ce jour-là avec l'heure, sans bouton. Rien si aucun.
- [x] Pas de bandeaux, pas d'état « tout est fait » animé, état vide simple si aucune prise prévue.
- [x] Tests RNTL : jour passé avec chaque statut, hors planning, jour vide.

## Étape 7 — En-tête

- [x] `TodayHeader` : `‹ date ›` avec deux `IconButton` (44 pt), « suivant » masqué sur aujourd'hui, « précédent » désactivé au premier jour d'historique.
- [x] Titre : « Aujourd'hui », « Hier », « Avant-hier », sinon la date (« Mardi 21 octobre ») ; formatage dans `utils/formatters.ts` (testé, français et anglais).
- [x] Lien « Revenir à aujourd'hui » sur un jour passé.
- [x] Icône calendrier en haut à droite (nouvelle icône `calendar` dans `iconShapes.tsx`), vers `calendar`.
- [x] Libellés accessibles : « Jour précédent : lundi 20 octobre », « Calendrier ».
- [x] Dynamic Type : la ligne de date passe à la ligne sans casser (iPhone 12 mini).
- [x] Changement de jour à minuit : l'onglet revient sur le nouveau jour s'il affichait aujourd'hui.
- [x] Tests RNTL de l'en-tête et de la navigation.
- [x] `make i18n-extract`, traductions anglaises.

- [x] `make tests` passe.
- [x] Tu vérifies sur l'iPhone : jour précédent / suivant, titres, retour à aujourd'hui, limites, texte agrandi, VoiceOver.

Je m'arrête et j'attends ta validation.

# Arrêt 3 — Calendrier

## Étape 8 — État d'un jour

- [x] Fonction pure (ex. `features/calendar/utils/computeDayStatus.ts`) : `missed` / `late` / `taken` / `skipped` / `none` selon les priorités de la spec, aujourd'hui sur les prises validées ou en retard seulement.
- [x] Requête du mois (ex. `getMonthHistory`) : prises prévues et logs de chaque jour du mois, en une ou deux requêtes (pas une par jour).
- [x] Grille du mois : jours alignés du lundi au dimanche, blancs avant le 1er.
- [x] Tests : chaque priorité, aujourd'hui, jour sans prise, versions, mois commençant un lundi / dimanche.

## Étape 9 — Écran Calendrier

- [x] Nouvelle feature `src/features/calendar/` (`CalendarScreen.tsx`, `components/`, `utils/`, `queries/`), ajoutée à `docs/architecture.md`.
- [x] Écran du design : retour « Aujourd'hui », titre, mois, mois précédent / suivant (désactivés aux limites), jours de la semaine, grille, légende.
- [x] Cellule : numéro + icône de l'état, couleurs du design en tokens (vérifier le contraste AA), contour « Aujourd'hui ».
- [x] Jours passés et aujourd'hui : boutons vers `day/[date]` ; futurs et avant l'historique : non cliquables.
- [x] Légende : « Pris », « Pris en retard », « Non pris », « Ignoré », « Aujourd'hui ».
- [x] Accessibilité : libellé par jour (« 8 octobre : aucune prise »), `accessibilityState` désactivé, jours de la semaine masqués à VoiceOver, cibles ≥ 44 pt.
- [x] Dynamic Type : grille lisible au maximum sur iPhone 12 mini (numéro seul si l'icône ne tient pas).
- [x] Jour ouvert depuis le calendrier : drawer (`Sheet`) avec la date en titre et « Fermer », sans chevrons ni retour. Aujourd'hui : contenu du jour avec ses actions.
- [x] En-tête du mois : les chevrons restent sur la ligne, le mois passe à la ligne si besoin.
- [x] Tests RNTL : mois courant, navigation de mois, limites, ouverture d'un jour.
- [x] `make i18n-extract`, traductions anglaises (mois et jours via la langue de l'app).

- [x] `make tests` passe.
- [x] Tu vérifies sur l'iPhone : états des jours avec les fixtures, navigation, écran d'un jour, VoiceOver, texte agrandi.

Je m'arrête et j'attends ta validation.

# Fin

## Étape 10 — E2E

- [x] `e2e/calendar.yaml` : ouvrir le calendrier, ouvrir un jour, jour précédent / suivant, revenir à aujourd'hui.
- [x] `make test-e2e` passe (si l'iPhone est branché : `maestro --device <simulator id> test e2e/`).

## Étape 11 — Fin

- [x] Docs à jour : `docs/database.md`, `docs/architecture.md`.
- [x] `specs/TODO_vrac.md` : cocher « vue calendrier ».
- [x] `make tests` passe.
- [x] Proposer une mise à jour de `CLAUDE.md` / docs si besoin (après ta validation seulement).
