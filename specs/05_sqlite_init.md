# Initialisation SQLite

Aujourd'hui, les prises utilisent des fixtures dans `src/features/pillbox/fixtures.ts`.

On veut passer des fixtures à une vraie base SQLite.

On veut exactement les mêmes « fixtures » ajoutées dans SQLite à la création de la base.

C'est un cas d'usage (prises + médicaments) : les données pourront être modifiées plus tard, mais la base ne doit pas être vide au départ (c'est pour le debug, cela changera quand le reste de l'app sera codé et qu'on pourra ajouter des médicaments et définir des prises).

Étapes :

- [ ] Installer SQLite
- [ ] Installer Drizzle
- [ ] Valider le schéma avec moi (arrêt avant l'étape suivante)
- [ ] Créer le schéma de la base (table des prises, table des médicaments) :
  - Schéma et fixtures dans un dossier `shared/database`.
  - Les requêtes vivent dans la feature (voir plus bas).
- [ ] Charger les fixtures à la création de la base
- [ ] Utiliser la base à la place des fixtures
  - Les requêtes vivent dans le dossier de la feature, par exemple `src/features/pillbox/queries/getAllIntakes.ts` (même si la feature « Aujourd'hui » utilisera cette requête, elle appartient au pilulier).
- [ ] Documenter la base dans `docs/database.md` et les choix récurrents dans `docs/architecture.md`

## Décisions

### Seed et migrations

- **Seed** : les fixtures sont insérées uniquement à la création de la base (base neuve). Les réinstallations depuis Xcode conservent les données ; pour repartir de zéro, supprimer l'app.
- **Migrations** : une première migration générée par `drizzle-kit` depuis le schéma, appliquée au démarrage (`useMigrations`).
- **Erreurs** : migration et seed dans une transaction (seed tout ou rien). En cas d'échec : splash masqué, écran d'erreur minimal et accessible.
- Base dans le dossier par défaut d'`expo-sqlite` (le déplacement vers l'App Group se fera avec le widget).

### Schéma

- Tables : `med`, `intake`, et une table de liaison `intake_med` (`intakeId`, `medId`, `quantity`).
- **Identifiants** : UUID v4 générés par Drizzle (`$defaultFn` + `randomUUID` d'`expo-crypto`), en vue d'un export futur.
- **Design de la pilule** : une colonne JSON typée `PillDesign`.
- **Jours d'une prise** : une colonne JSON typée `Weekday[]`.
- **Hors prises** : colonne explicite `isAsNeeded` sur `med` (un médicament pourra quitter une prise et rester en stock).
- Le format exact des colonnes (ex. l'heure) est fixé à l'étape de validation du schéma.

### Types

- `src/domain/` garde les types métier : `PillDesign`, `Weekday` et les agrégats `Med`, `Intake` (avec `medQuantities`).
- Le schéma (`shared/database`) importe ces types pour typer les colonnes JSON.
- Les requêtes assemblent les lignes SQL en agrégats du domaine.

### Lecture et tri

- Requêtes dans `src/features/pillbox/queries/`, la base est passée en paramètre (testable).
- L'écran lit via un hook de la feature (ex. `usePillboxData`) : lecture synchrone, relue quand l'onglet reprend le focus.
- Prises triées par heure, en SQL (`ORDER BY`).
- Médicaments d'une prise et médicaments hors prises : tri alphanumérique par nom puis dosage (« 50 mg » avant « 100 mg »), dans une fonction pure de la feature appelée par le hook. Pas de tri SQL pour eux.

### Tests et QA

- Jest + `better-sqlite3` en mémoire : migration et seed appliqués, une suite de tests par requête.
- Tests unitaires de la fonction de tri.
- Le test Maestro existant est adapté au nouvel ordre des médicaments et doit passer (`clearState` = base neuve = seed).

### Documentation

- `docs/database.md` (orienté implémentation, exemples tirés de Pilbo, clair et concis) :
  - fonctionnement global (ouverture, migration, seed au démarrage) ;
  - écrire une migration ;
  - écrire une requête (dossier, lecture `sql` brut + alias camelCase, écriture Drizzle, test `better-sqlite3`) ;
  - subtilités Drizzle (colonnes JSON typées, UUID, booléens SQLite, transactions…) ;
  - section **Schéma** : tables et champs, maintenue à chaque migration.
- `docs/architecture.md` : choix récurrents (dossier `shared/database`, `queries/` dans la feature, hook relu au focus, tri dans une fonction pure, base passée en paramètre).
- `CLAUDE.md` (proposé en fin de spec, après validation) : lien vers `docs/database.md`, règle « mettre à jour la section Schéma à chaque migration », suppression de « migration shall not be implemented ».
