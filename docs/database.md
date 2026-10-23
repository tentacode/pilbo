# Base de données

SQLite local via `expo-sqlite`, manipulé avec Drizzle ORM. Aucune donnée ne quitte le téléphone.

## Fonctionnement global

### Fichiers (`src/shared/database/`)

```
database.ts             // ouvre pilbo.db (expo-sqlite) + drizzle, active les clés étrangères
schema.ts               // tables Drizzle : source de vérité des types
types.ts                // type Database (base Drizzle synchrone, app et tests)
migrations/             // généré par drizzle-kit, ne pas modifier à la main
fixtures.ts             // données de debug insérées au premier lancement (debug)
seed.ts                 // seedDatabase(database)
clearDatabase.ts        // clearDatabase(database) : vide intake_log, med_log, med, intake, intake_med
resetDatabase.ts        // resetDatabase(database) : clearDatabase puis seedDatabase
hooks/useDatabaseReady.ts // migration au démarrage, puis callback onMigrated
DatabaseErrorScreen.tsx // écran affiché si la migration ou le seed échoue
testDatabase.ts         // base better-sqlite3 en mémoire pour Jest
testHelpers.ts          // utilitaires de test (countRows)
sql.d.ts                // import des fichiers .sql (migrations)
```

### Au démarrage

1. `src/app/_layout.tsx` appelle `useDatabaseReady()`.
2. `migrate()` applique les migrations pas encore jouées (table `__drizzle_migrations`).
3. Callback `onMigrated` : `setupFirstLaunch()` (`features/onboarding/utils/`).
   - Debug (`EXPO_PUBLIC_DEBUG_MODE=true`) et premier lancement après installation : `seedDatabase()` insère les fixtures (si la table `med` est vide, dans une transaction), et l'onboarding est marqué comme fait.
   - Sinon : rien. Plus de re-seed quand la base est vide.
   - Premier lancement = clé `onboarding` absente du kv-store (`expo-sqlite/kv-store`, voir le store `features/onboarding/store/onboardingStore.ts`).
4. Le splash est masqué quand polices et base sont prêtes. En cas d'erreur : `DatabaseErrorScreen`.

- La base vit dans le dossier par défaut d'`expo-sqlite`.
- Une réinstallation depuis Xcode conserve les données. Pour repartir de zéro : supprimer l'app.
- Réglages, section « Debug » (10 appuis sur « Version », state local non persisté, indépendant de `EXPO_PUBLIC_DEBUG_MODE`) :
  - « Supprimer les données » : après confirmation, supprime toutes les données et réaffiche l'onboarding. Pas de seed au lancement suivant.
  - « Réinitialiser avec des données de test » : après confirmation, vide puis réinsère les fixtures, onboarding marqué comme fait.
  - Les écrans relisent la base au focus de l'onglet.
- Le seed est temporaire (debug), il disparaîtra quand on pourra créer des prises dans l'app.

## Écrire une migration

1. Modifier `src/shared/database/schema.ts` (ex. ajouter `note: text("note")` à `medTable`).
2. `make db-generate` : crée `migrations/000X_<nom>.sql` et met à jour `migrations/migrations.js`.
3. Relire le SQL généré (SQLite ne sait pas tout faire avec `ALTER TABLE` : drizzle-kit peut recréer la table).
4. Rebuild l'app (`make build-simulator`) : la migration est jouée au lancement suivant.
5. Mettre à jour la section [Schéma](#schéma) ci-dessous.

## Écrire une requête

- Une requête appartient à une feature : `src/features/<feature>/queries/<nomDeLaRequete>.ts`.
- Elle reçoit la base en paramètre (`database: Database`) : l'app passe la vraie base, les tests une base en mémoire.

### Lecture : SQL brut

```ts
export function getAsNeededMeds(database: Database): Med[] {
  const records = database.all<MedRecord>(sql`
    SELECT
      ${medTable.id} AS id,
      ${medTable.isAsNeeded} AS isAsNeeded
      ...
    FROM ${medTable}
    WHERE ${medTable.isAsNeeded} = 1
  `);
  return records.map(toMed);
}
```

- Colonnes via `${table.colonne}`, jamais de nom en dur.
- Alias en camelCase (`AS isAsNeeded`).
- Le résultat brut n'est pas converti : JSON en texte, booléens en `0`/`1`. Convertir vers le type du domaine (ex. `toMed` dans `queries/medRecord.ts`).
- Jointures : assembler les lignes en agrégats (voir `getAllIntakes.ts`).

### Écriture : Drizzle ORM

```ts
database
  .insert(intakeTable)
  .values({ hour: 8, minute: 20, days: ["monday"], reminderIntervalMinutes: 10 })
  .run();

database
  .update(medTable)
  .set({ isAsNeeded: true })
  .where(sql`${medTable.id} = ${medId}`)
  .run();

database
  .delete(intakeTable)
  .where(sql`${intakeTable.id} = ${intakeId}`)
  .run();
```

- Toujours terminer par `.run()`, `.get()` ou `.all()` : la base est synchrone.
- Ici Drizzle convertit JSON, booléens et génère l'UUID.

### Tester

```ts
const database = createTestDatabase(); // migrations + seed
const empty = createTestDatabase({ seed: false });
```

Test à côté de la requête : `queries/getAllIntakes.spec.ts`.

## Subtilités

- **Types du schéma** : `MedRow`, `NewMedRow`… (`$inferSelect` / `$inferInsert`) dans `schema.ts`.
- **Colonnes JSON** : `text("design", { mode: "json" }).$type<PillDesign>()`. Drizzle sérialise à l'écriture et parse à la lecture ORM, **pas** en SQL brut (`JSON.parse` nécessaire).
- **Booléens** : SQLite stocke `0`/`1`. `integer({ mode: "boolean" })` convertit côté ORM, pas en SQL brut (`=== 1`).
- **UUID** : `$defaultFn(generateId)` (`randomUUID` d'`expo-crypto`), uniquement pour les écritures Drizzle. `expo-crypto` est chargé à la demande car `drizzle-kit` lit le schéma dans Node. En test, il est remplacé par `crypto.randomUUID` (`jest.setup.ts`).
- **Transactions** : `database.transaction((transaction) => { ... })`, callback **synchrone**, utiliser `transaction` et pas `database` à l'intérieur.
- **Clés étrangères** : désactivées par défaut dans SQLite, activées à l'ouverture (`PRAGMA foreign_keys = ON`), y compris dans la base de test.
- **Dates en texte local** : `intake_log` et `med_log` stockent ses dates en heure locale, sans fuseau (`"2026-10-14T08:20"`). Filtre du jour simple (`LIKE '2026-10-14%'`), lisible depuis Swift. Conversion avec `toLocalDate`, `toLocalDateTime`, `fromLocalDateTime` (`src/domain/intakeLog.ts`).
- **Résultats bruts = casts** : `database.all<Type>(...)` ne vérifie rien. Toute requête doit avoir son test.

## Schéma

> Migration `0002` (spec 12) : nouveau format de `design`, sans conversion des données existantes. Base à vider après cette migration : supprimer puis réinstaller l'app.

### `med`

Un médicament existe indépendamment des prises. Il peut être dans une ou plusieurs prises et hors planning en même temps.

| Colonne        | Type                     | Contraintes                                           |
| -------------- | ------------------------ | ----------------------------------------------------- |
| `id`           | text (UUID)              | clé primaire                                          |
| `name`         | text                     | obligatoire                                           |
| `strength`     | text                     | obligatoire, texte libre, `""` si absent (« 250 mg ») |
| `detail`       | text                     | obligatoire, `""` par défaut (« Avec le repas »)      |
| `design`       | text (JSON `PillDesign`) | obligatoire                                           |
| `is_as_needed` | integer (booléen)        | obligatoire, `false` par défaut (hors planning)       |

Format de `design` (`src/domain/med.ts`) :

```json
{ "shape": "capsule", "size": "medium", "colors": ["#F58FB8", "#FFFFFF"] }
```

- `shape` : `round`, `oval`, `capsule`, `softgel`, `triangle`, `square`. Configuration par forme dans `PILL_SHAPES`.
- `size` : `small`, `medium`, `large`.
- `colors` : toujours 2 couleurs, une par moitié, pour toutes les formes (identiques pour une pilule unie). Une ancienne valeur à 1 couleur est relue comme unie.

### `intake`

| Colonne                     | Type                    | Contraintes                     |
| --------------------------- | ----------------------- | ------------------------------- |
| `id`                        | text (UUID)             | clé primaire                    |
| `hour`                      | integer                 | obligatoire (0–23)              |
| `minute`                    | integer                 | obligatoire (0–59)              |
| `days`                      | text (JSON `Weekday[]`) | obligatoire                     |
| `reminder_interval_minutes` | integer                 | obligatoire                     |
| `is_archived`               | integer (booléen)       | obligatoire, `false` par défaut |

### `intake_med`

| Colonne     | Type    | Contraintes                                         |
| ----------- | ------- | --------------------------------------------------- |
| `intake_id` | text    | → `intake.id`, supprimé avec la prise (`cascade`)   |
| `med_id`    | text    | → `med.id`, suppression d'un médicament lié bloquée |
| `quantity`  | integer | obligatoire                                         |

Clé primaire : (`intake_id`, `med_id`).

### `intake_log`

Historique des prises validées. Une prise archivée garde ses logs.

| Colonne              | Type        | Contraintes                                            |
| -------------------- | ----------- | ------------------------------------------------------ |
| `id`                 | text (UUID) | clé primaire                                           |
| `intake_id`          | text        | → `intake.id`, suppression de la prise bloquée         |
| `expected_intake_at` | text        | obligatoire, jour et heure prévus (`2026-10-14T08:20`) |
| `created_at`         | text        | obligatoire, moment de l'appui (`2026-10-14T09:05`)    |
| `status`             | text        | obligatoire, `"taken"` ou `"skipped"`                  |

### `med_log`

Prises des médicaments hors planning. Un médicament peut être pris plusieurs fois par jour.

| Colonne    | Type        | Contraintes                                          |
| ---------- | ----------- | ---------------------------------------------------- |
| `id`       | text (UUID) | clé primaire                                         |
| `med_id`   | text        | → `med.id`, suppression du médicament bloquée        |
| `taken_at` | text        | obligatoire, moment de la prise (`2026-10-14T15:40`) |
