# Spec 05 — Initialisation SQLite

## Contexte

Remplacer les fixtures du pilulier par une base SQLite (expo-sqlite + Drizzle), seedée avec les mêmes données à la création de la base, et documenter comment travailler avec la base. Spec et décisions : `specs/05_sqlite_init.md`.

Fichiers utiles : `CLAUDE.md` (stack, règles SQL), `docs/architecture.md`, `src/features/pillbox/fixtures.ts`, `src/features/pillbox/PillboxScreen.tsx`, `src/domain/intake.ts`, `src/domain/med.ts`, `src/app/_layout.tsx`, `e2e/`, `pnpm-workspace.yaml`.

> Chaque case est cochée dès que l'étape est faite et vérifiée.

## Étape 1 — Installer SQLite

- [x] `npx expo install expo-sqlite expo-crypto`. Plugin `expo-sqlite` ajouté à `app.config.ts`.
- [x] `npx expo-doctor` passe. (seul échec : conflit préexistant du script `prettier`, hors scope).

## Étape 2 — Installer Drizzle

- [x] `pnpm add drizzle-orm`, `pnpm add -D drizzle-kit babel-plugin-inline-import better-sqlite3 @types/better-sqlite3`.
- [x] Autoriser la compilation de `better-sqlite3` dans `pnpm-workspace.yaml` (`allowBuilds`).
- [x] Config Expo pour les migrations (doc Drizzle « Expo SQLite ») :
  - [x] `babel.config.js` : plugin `inline-import` pour les `.sql`.
  - [x] `metro.config.js` : ajouter `sql` aux `sourceExts`.
  - [x] Déclaration TypeScript des modules `*.sql`.
- [x] `drizzle.config.ts` : `dialect: "sqlite"`, `driver: "expo"`, schéma `src/shared/database/schema.ts`, sortie `src/shared/database/migrations`.
- [x] Commande `make db-generate` (`drizzle-kit generate`) dans le `Makefile`.

## Étape 3 — Valider le schéma

- Proposer le schéma (tables `med`, `intake`, `intake_med`, colonnes, types, contraintes, clés étrangères) selon les décisions de la spec.
- Trancher avec toi le format de l'heure d'une prise (ex. `hour` + `minute` entiers, ou minutes depuis minuit) et les colonnes exactes.
- [x] Schéma validé.

Je m'arrête et j'attends ta validation.

## Étape 4 — Créer le schéma

- [x] `src/shared/database/schema.ts` : tables `med`, `intake`, `intake_med`.
  - [x] UUID : `text("id").primaryKey().$defaultFn(generateId)`, `expo-crypto` chargé à la demande (drizzle-kit lit le schéma dans Node) et mocké dans `jest.setup.ts`.
  - [x] Colonnes JSON typées : `text({ mode: "json" }).$type<PillDesign>()`, `.$type<Weekday[]>()`.
  - [x] Booléen `isAsNeeded` : `integer({ mode: "boolean" })`.
  - [x] Clés étrangères de `intake_med` vers `intake` et `med`.
- [x] Type partagé `Database` (base Drizzle synchrone, compatible expo-sqlite et better-sqlite3) dans `src/shared/database/types.ts` (`Database.ts` entrait en collision avec `database.ts` sur macOS).
- [x] `src/shared/database/database.ts` : `openDatabaseSync` (dossier par défaut) + `drizzle(...)` + `PRAGMA foreign_keys = ON`.
- [x] `make db-generate` → première migration dans `src/shared/database/migrations/`, SQL relu. Dossier exclu de Prettier et ESLint (fichiers générés).
- [x] Ajouter `isAsNeeded` au type `Med` de `src/domain/med.ts` si nécessaire.

## Étape 5 — Seed à la création de la base

- [x] Déplacer les données de `src/features/pillbox/fixtures.ts` vers `src/shared/database/fixtures.ts` (Prazépam avec `isAsNeeded: true`), supprimer l'ancien fichier.
- [x] `src/shared/database/seed.ts` : `seedDatabase(database)` insère médicaments, prises et liaisons dans **une transaction**.
- [x] Seed temporaire (debug) : uniquement si la table `med` est vide.
- [x] Démarrage dans `src/app/_layout.tsx` (via `shared/database/hooks/useDatabaseReady.ts`) : `migrate` (version promesse de `useMigrations`), puis seed, avant de masquer le splash.
- [x] Écran d'erreur minimal si migration ou seed échoue : splash masqué, composant `Text` du design system, `accessibilityRole="header"` sur le titre, tokens uniquement.
- [x] Helper de test `src/shared/database/testDatabase.ts` : better-sqlite3 en mémoire + `migrate` (`drizzle-orm/better-sqlite3/migrator`) + seed.
- [x] Tests Jest du seed (nombre de lignes, seed non rejoué si la base contient déjà des médicaments).

## Étape 6 — Utiliser la base

- [x] `src/features/pillbox/queries/getAllIntakes.ts` : `getAllIntakes(database)`, SQL brut (`sql`, colonnes `${table.column}`, alias camelCase), `ORDER BY` heure, assemblage en `Intake[]`.
- [x] `src/features/pillbox/queries/getAsNeededMeds.ts` : médicaments `isAsNeeded`. Conversion commune des lignes dans `queries/medRecord.ts` (`toMed`).
- [x] Tests Jest à côté de chaque requête (`.spec.ts`) avec la base de test.
- [x] Fonction pure de tri alphanumérique (nom puis dosage, `localeCompare` avec `numeric: true`) dans la feature (`src/features/pillbox/utils/sorters.ts`) + tests (« 50 mg » avant « 100 mg »).
- [x] Hook `src/features/pillbox/hooks/usePillboxData.ts` : lecture synchrone, relue via `useFocusEffect` (Expo Router), tri appliqué.
- [x] `PillboxScreen.tsx` utilise le hook au lieu des fixtures.
- [x] Adapter `e2e/` au nouvel ordre (ex. matin : « Lamictal 50 mg… Lithium 250 mg… », nuit : « Lamictal 100 mg… Prégabaline 50 mg… Quviviq 50 mg… »).
- [x] `make build-simulator` puis `make test-e2e` passe.
- [x] Tu vérifies sur l'iPhone (`make build-device`) : pilulier identique, données conservées après réinstallation.

## Étape 7 — Documentation

- [x] `docs/database.md` (clair, concis, exemples tirés de Pilbo, pas de foobar) :
  - [x] Fonctionnement global : ouverture, migration, seed au démarrage, fichiers de `src/shared/database/`.
  - [x] Écrire une migration : modifier `schema.ts` → `make db-generate` → relire le SQL → rebuild.
  - [x] Écrire une requête : dossier `features/<feature>/queries/`, base en paramètre, lecture `sql` brut + alias camelCase, écriture Drizzle (`insert`, `update`, `delete` avec `sql`), test avec la base de test.
  - [x] Subtilités Drizzle : colonnes JSON typées, UUID `$defaultFn`, booléens SQLite (0/1), transactions, clés étrangères, types des résultats bruts = casts.
  - [x] Section **Schéma** : tables et champs.
- [x] `docs/architecture.md` : arborescence (`shared/database/`, `features/<feature>/queries/`) et choix récurrents (hook relu au focus, tri dans une fonction pure, base passée en paramètre).

## Étape 8 — Fin

- [x] `make tests` passe (override `esbuild@<0.24.3` dans `pnpm-workspace.yaml` : faille modérée via drizzle-kit, `make db-generate` vérifié après).
- [x] Proposer une mise à jour de `CLAUDE.md` (après ta validation seulement) : lien vers `docs/database.md`, règle « mettre à jour la section Schéma à chaque migration », suppression de « migration shall not be implemented », commande `make db-generate`.
