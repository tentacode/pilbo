# Spec 07 — Écran « Aujourd'hui »

## Contexte

Intégrer l'écran « Aujourd'hui » du design (en-tête « Pilules ton sur ton », cartes en retard / prochaine / plus tard, état vide) à partir des prises du jour lues dans SQLite. Pas d'interaction : les boutons sont prêts pour la spec de validation des prises. Spec et décisions : `specs/07_today_screen.md`.

À lire avant de commencer :

- `CLAUDE.md`, `docs/architecture.md`, `docs/database.md`.
- Design (Claude Design) : artboards `today-next.dc.html`, `Main.dc.html`, `today-edge.dc.html`, `hero-pilules.dc.html`, `empty-today-none.dc.html`, et les styles `pilbo.css` (lecture via l'outil Artifact, action `read` avec `path` : `project/<fichier>`).
- Code existant : `src/features/pillbox/` (requête, hook, cartes, formatters, sorters), `src/design-system/components/Button/`, `src/shared/database/seed.ts`, `src/features/settings/`.

Tu peux passer chaque étape à la suite, mais tu dois poser des questions si il y a un doute ou si il y a des changements de dernière minute.

## Étape 1 — Cloisonnement des features

- [x] `docs/architecture.md` : tableau des règles, `features/` peut importer une autre feature quand c'est raisonnable (retirer « une autre feature » de la colonne « Ne doit pas importer »).
- [x] `make tests` passe.

## Étape 2 — Fonctions pures dans `domain/`

- [x] `compareMeds` : de `features/pillbox/utils/sorters.ts` vers `src/domain/med.ts`.
- [x] `sortIntakeMeds` : vers `src/domain/intake.ts`.
- [x] `formatIntakeTime` : de `features/pillbox/utils/formatters.ts` vers `src/domain/intake.ts`.
- [x] Mettre à jour les imports du pilulier (`IntakeCard`, `usePillboxData`, `sorters.ts` pour `sortMeds`…).
- [x] Déplacer les tests concernés (`sorters.spec.ts`) à côté des fichiers de `domain/` (`med.spec.ts`, `intake.spec.ts`), ajouter un test de `formatIntakeTime`.
- [x] `docs/architecture.md` : `domain/` = types métier et fonctions pures partagées (arborescence + tableau des règles).
- [x] `make tests` passe.

## Étape 3 — Variantes du `Button`

Référence : classes `.btn`, `.btn-2`, `.btn-2.lg`, `.btn-2.on-hero`, `.btn-t` de `pilbo.css`.

- [x] Tokens manquants dans `tokens.ts` (couleurs du secondaire, du pressé, tailles, espacements), contraste AA vérifié.
- [x] `Button.tsx` : props `variant` (`primary` par défaut, `secondary`, `text`), `size` (`regular` par défaut, `large`), `icon?: IconName` (icône à gauche du libellé, `aria-hidden` côté RN : `accessible={false}`), `accessibilityLabel?` (sinon `label`).
- [x] `Button.styles.ts` : styles par variante et taille, `minHeight` ≥ `sizes.touchTarget`, pas de hauteur fixe (Dynamic Type).
- [x] Tone de texte pour le secondaire et le texte seul si besoin (`Text.styles.ts`).
- [x] Usages existants inchangés (`ErrorScreen`).
- [x] `Button.spec.tsx` : chaque variante rend le libellé, `accessibilityLabel` personnalisé, `onPress` appelé.
- [x] `make tests` passe.

## Étape 4 — Outils de test dans Réglages

- [x] `src/shared/database/clearDatabase.ts` : `clearDatabase(database)` supprime `intake` (cascade sur `intake_med`) puis `med`, en transaction (écritures Drizzle).
- [x] `src/shared/database/resetDatabase.ts` : `resetDatabase(database)` = `clearDatabase` puis `seedDatabase`.
- [x] Tests Jest (`createTestDatabase()`) : tables vides après `clearDatabase`, fixtures présentes après `resetDatabase`.
- [x] `features/settings/components/ClearDatabaseButton.tsx` (« Vider la base ») et `ResetDatabaseButton.tsx` (« Réinitialiser la base ») : `Button` variante `secondary`, appellent la fonction avec `database`. Tests RNTL (rôle, libellé, fonction appelée).
- [x] `SettingsScreen.tsx` : ajout dans la section `__DEV__`, à côté de `CrashTestButton`.
- [x] `docs/database.md` : mentionner les deux boutons (et que le seed revient au relancement après « Vider la base »).
- [x] `make tests` passe.
- [x] Tu vérifies sur le simulateur : vider → pilulier vide ; réinitialiser → fixtures de retour.

## Étape 5 — Requête `getTodayIntakes`

- [x] `src/features/today/queries/getTodayIntakes.ts` : `getTodayIntakes(database, weekday): Intake[]`.
  - Même forme que `features/pillbox/queries/getAllIntakes.ts` (SQL brut, colonnes `${table.column}`, alias camelCase, agrégation en `Map`, `toMed` importé du pilulier).
  - Filtre du jour en SQL : `EXISTS (SELECT 1 FROM json_each(${intakeTable.days}) WHERE value = ${weekday})`.
  - `INNER JOIN` sur `intake_med` et `med` : une prise sans médicament est masquée.
  - `ORDER BY` heure, minute.
- [x] `getTodayIntakes.spec.ts` : fixtures (4 prises, ordre), filtre par jour (prise insérée seulement le lundi absente le mardi), prise sans médicament absente, base vide → `[]`.
- [x] `make tests` passe.

## Étape 6 — Calcul des états

Tout dans `src/features/today/utils/`, fonctions pures, `now: Date` en paramètre.

- [x] Types (`utils/todayTypes.ts` ou équivalent) :
  - `IntakeStatus` : `"late" | "next" | "later"` (union pensée pour accueillir `"taken" | "skipped"`).
  - `TodayIntake` : `intake`, `status`, `minutesFromNow` (négatif si passé).
  - `TodaySections` : `late: TodayIntake[]`, `next: TodayIntake | null`, `later: TodayIntake[]`.
- [x] `utils/computeTodayIntakes.ts` :
  - Constante `LATE_THRESHOLD_MINUTES = 30`.
  - En retard : passée depuis plus de 30 min. Prochaine : première prise non en retard (y compris dans sa marge). Plus tard : les suivantes.
  - `weekdayOf(now)` pour passer le bon `Weekday` à la requête.
- [x] `utils/formatters.ts` :
  - Date : « Dimanche 4 octobre » (tableaux de jours et mois en dur).
  - Durée écran : « 45 min », « 2 h 05 », « 3 h » ; durée VoiceOver : « 45 minutes », « 2 heures 5 minutes », « 1 heure ».
  - Statut : « Dans 2 h 25 », « C'est l'heure », « En retard · 40 min », « À venir » (+ versions VoiceOver).
  - Résumé de l'en-tête : « 0 prise sur 4 · prochaine à 12:30 » / « 0 prise sur 4 · 1 en retard » (pluriel « prises » à partir de 2).
  - Titre de section en retard : `null` pour 1, « N prises en retard » à partir de 2.
  - Libellés d'accessibilité des boutons : « Prendre la prise de 12:20 », « Ignorer la prise de 12:20 ».
- [x] Tests (`computeTodayIntakes.spec.ts`, `formatters.spec.ts`) avec une heure fixée : avant toutes les prises, pile à l'heure, +29 min (prochaine, « C'est l'heure »), +31 min (en retard), plusieurs en retard, toutes en retard (pas de prochaine), aucune prise ; tous les formats de durée et de date.
- [x] `make tests` passe.

## Étape 7 — Hook `useTodayData`

- [x] `src/features/today/hooks/useCurrentMinute.ts` : `Date` mise à jour au changement de minute (`setTimeout` calé sur la minute suivante, puis relancé) et au retour au premier plan (`AppState` `change` → `active`). Nettoyage au démontage.
- [x] `src/features/today/hooks/useTodayData.ts` :
  - Lecture SQL au focus (`useFocusEffect`, comme `usePillboxData`) : `getTodayIntakes(database, weekdayOf(new Date()))`, médicaments triés avec `sortIntakeMeds`.
  - États recalculés avec `useCurrentMinute()` (`useMemo`), sans relecture SQL.
  - Retourne `date`, sections, résumé.
- [x] Test du hook si simple (timers Jest factices), sinon couvert par les tests de l'écran.
- [x] `make tests` passe.

## Étape 8 — En-tête « Pilules ton sur ton »

Référence : `hero-pilules.dc.html` (classes `.hero`, `.hero-row`, `.ttl`, `.sm`, `.soft`).

- [x] Tokens des couleurs ton sur ton (`#FDEAF2`, `#EFEAFC`, `#FFF5D8`, `#E1F6F2`) et tailles utiles.
- [x] `features/today/components/TodayHeaderDecoration.tsx` : SVG décoratif (`react-native-svg`) en absolu derrière le contenu, non accessible.
- [x] `features/today/components/TodayHeader.tsx` + `.styles.ts` : props `date`, `summary?`, `onAddUnscheduled`.
  - Ligne date (`small`, `secondary`) + `Button` `secondary` icône `plus` « Hors planning » (libellé VoiceOver « Ajouter une prise hors planning »).
  - Titre « Aujourd'hui » (`title`, `accessibilityRole="header"`).
  - Résumé (absent si `summary` est vide).
  - Dynamic Type : la ligne date / bouton passe à la ligne si besoin.
- [x] `TodayHeader.spec.tsx` : titre header, date, bouton (rôle, libellé, `onAddUnscheduled`), résumé absent si vide.
- [x] `make tests` passe.

## Étape 9 — Cartes de prise

Référence : `.card`, `.card.late`, `.card-head`, `.time`, `.pst`, `.pst.late`, `.acts`, `.meds` de `pilbo.css`. Lignes de médicament : `IntakeMedRow` importé de `features/pillbox/components/`.

- [x] Tokens manquants (fond / bordure de la carte en retard, couleur du statut en retard), contraste AA.
- [x] Icônes manquantes dans `iconShapes.tsx` : `clock`, `alert` (cercle + point d'exclamation), `check`.
- [x] `features/today/components/IntakeStatusLabel.tsx` : icône + texte du statut, libellé VoiceOver complet.
- [x] `LateIntakeCard.tsx` : heure, statut « En retard · … », médicaments, `Button` `primary` icône `check` « Je l'ai pris » + `Button` `text` « Ignorer ».
- [x] `NextIntakeCard.tsx` : heure, « Dans … » / « C'est l'heure », médicaments, `Button` `secondary` `large` « Je l'ai pris » + `Button` `text` « Ignorer ».
- [x] `LaterIntakeCard.tsx` : heure, « À venir », petit `Button` `secondary` « Prendre » dans l'en-tête de carte, médicaments.
- [x] Props communes : `todayIntake`, `onTake(intakeId)`, `onSkip(intakeId)` (sauf `onSkip` pour plus tard). Un fichier `.styles.ts` par composant.
- [x] Tests RNTL par carte : heure, statut, libellés d'accessibilité des boutons, callbacks appelés avec l'id.
- [x] `make tests` passe.

## Étape 10 — Assemblage de l'écran et état vide

- [x] `features/today/components/TodayEmptyState.tsx` + `.styles.ts` : illustration de `empty-today-none.dc.html` en SVG (non accessible), titre « Rien à prendre aujourd'hui » (`heading`, header), texte « Une journée tranquille côté pilulier. Prochaine prise lundi à 23:59. ». Carte blanche avec bordure (pas de fond lavande).
- [x] `features/today/components/TodaySectionTitle.tsx` si utile (`heading`, header).
- [x] `TodayScreen.tsx` :
  - `TodayHeader` (sans résumé si aucune prise).
  - Sans prise en retard : « Prochaine prise » (`NextIntakeCard`) puis « Plus tard » (`LaterIntakeCard`).
  - Avec prise(s) en retard : titre « N prises en retard » (à partir de 2), `LateIntakeCard`s, puis « Ensuite » (`NextIntakeCard` puis `LaterIntakeCard`s).
  - Sections vides non affichées.
  - Aucune prise : `TodayEmptyState`.
  - `onTake`, `onSkip`, `onAddUnscheduled` définis dans l'écran, sans effet.
- [x] `TodayScreen.spec.tsx` : base en mémoire + heure fixée (mock de `database` et `jest.useFakeTimers().setSystemTime`), sections attendues ; base vide → état vide.
- [x] `make tests` passe.
- [ ] Tu vérifies sur l'iPhone : rendu vs design, VoiceOver, Dynamic Type, Reduce Motion, mise à jour à la minute, état vide via « Vider la base ».

## Étape 11 — Test Maestro

- [x] `e2e/today.yaml` : `launchApp` (`clearState: true`), titre « Aujourd'hui », date du jour calculée en JS (`evalScript` → `output`, mêmes noms de jours et mois que l'app), présence des heures des fixtures (08:20, 12:20, 20:20, 22:00) et des médicaments. Pas de vérification des états horaires.
- [x] `make test-e2e` passe sur le simulateur.

## Étape 12 — Fin

- [x] `docs/architecture.md` : nouveaux choix récurrents si besoin (ex. calcul basé sur l'heure dans `utils/`, hook `useCurrentMinute`).
- [x] `make tests` passe.
- [x] Proposer une mise à jour de `CLAUDE.md` / docs si besoin (après ta validation seulement).
