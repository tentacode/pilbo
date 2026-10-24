# Spec 15 — Stocks

## Contexte

Suivi facultatif du stock de chaque médicament : écran Stock (liste, sélecteur, modification), baisse à chaque prise, stock bas calculé exactement à partir des prises à venir, avertissement, badge et notification à 9h. Spec et décisions : `specs/15_stocks.md`.

À lire avant de commencer :

- `CLAUDE.md`, `docs/architecture.md`, `docs/database.md` (écrire une migration, requêtes, transactions), `docs/notifications.md`.
- Design : artboards « Stock · Liste » (`project/stock.dc.html`), « Stock · Stock normal » (`project/stock-lithium.dc.html`), « Stock · Stock bas » (`project/stock-metformine.dc.html`), « Vide · Stock, aucun médicament » (`project/empty-stock.dc.html`) dans https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4 (lecture avec l'outil Artifact, action `read` + `path`, styles dans `project/pilbo.css`).
- Code existant :
  - Base : `src/shared/database/schema.ts`, `fixtures.ts`, `seed.ts`, `clearDatabase.ts`, `testDatabase.ts`, `database.ts` (`subscribeToDatabaseChanges`).
  - Écran provisoire : `src/features/stocks/StocksScreen.tsx`, route `src/app/(tabs)/stocks.tsx`.
  - Prises : `src/domain/intake.ts` (`Intake`, `intakeDateOn`, `WEEKDAYS`), `src/domain/intakeLog.ts`, `src/features/today/queries/getTodayIntakes.ts`, `getIntakeLogsOfDay.ts`, `src/features/today/utils/computeTodayIntakes.ts` (`weekdayOf`).
  - Validation : `src/features/today/hooks/useIntakeValidation.ts`, `queries/insertIntakeLog.ts`.
  - Hors planning : `src/features/today/hooks/useAsNeededTaking.ts`, `queries/insertMedLog.ts`, `deleteMedLogsOfDay.ts`, `getLastMedLogsOfDay.ts`, `components/AsNeededMedRow.tsx`, `e2e/as-needed.yaml`.
  - Aujourd'hui : `src/features/today/TodayScreen.tsx`, `components/RemindersDisabledNotice.tsx` (modèle du bandeau), `hooks/useTodayData.ts`.
  - Onglets : `src/app/(tabs)/_layout.tsx` (`badgeCounts`), `src/shared/navigation/tabs.ts` (`formatBadgeLabel`), `hooks/usePendingPastIntakeCount.ts` (modèle `useSyncExternalStore`).
  - Médicaments : `src/features/pillbox/MedScreen.tsx`, `MedPickerScreen.tsx`, `components/PickerMedRow.tsx`, `hooks/useAllMeds.ts`, `queries/getAllMeds.ts`, `src/domain/med.ts` (`formatMedLabel`, `compareMeds`).
  - Édition avec modale d'abandon : `src/features/pillbox/IntakeEditScreen.tsx`, `hooks/useModalClosing.ts`, `components/DiscardChangesDialog.tsx`.
  - Notifications : `src/features/notifications/rescheduleReminders.ts`, `utils/planReminders.ts`, `notifications.ts` (`resetReminders`), `utils/formatters.ts`, `src/config/notifications.ts`.
  - Réglages : `src/features/settings/store/settingsStore.ts` (`lowStockDays`, `LOW_STOCK_DAYS`).
  - Design system : `Screen`, `ScreenHeader`, `Sheet`, `Stepper`, `TextField`, `Dialog`, `Button`, `Pill`, `Icon`, `Text`, `useFitsInWidth`, `tokens.ts`.
  - Routes : `src/app/_layout.tsx` (Stack racine, modales `intake` et `as-needed`).

# Arrêt 1 — Liste des stocks (en lecture)

## Étape 1 — Table `stock`

- `schema.ts` : `stockTable` (`med_id` clé primaire → `med.id` `cascade`, `quantity`, `box_size`, `low_stock_days`, tous obligatoires) + types `StockRow` / `NewStockRow`.
  - [x] `make db-generate`, relire le SQL généré.
  - [x] Type du domaine `Stock` (ex. `src/domain/stock.ts`) et constantes (taille de boîte 1–999, 30 par défaut ; restants 0–9999).
- [x] `clearDatabase.ts` vide aussi `stock` (test à jour).
- [x] `docs/database.md` : section Schéma (`stock`), liste des tables vidées par `clearDatabase`.

## Étape 2 — Requêtes de stock

Dans `src/features/stocks/queries/` (SQL brut pour les lectures, Drizzle pour les écritures), chacune testée avec une base en mémoire :

- [x] `getAllStocks(database)` : stocks avec leur médicament.
- [x] `getStockByMedId(database, medId)`.
- [x] `saveStock(database, stock)` : insert ou update (`onConflictDoUpdate`).
- [x] `deleteStock(database, medId)`.
- [x] `decreaseStocks(database, medQuantities)` : baisse les stocks existants, ignore les médicaments sans stock, renvoie les médicaments passés de ≥ 0 à < 0. Appelable dans une transaction.
- [x] `increaseStock(database, medId, quantity)` (annulation hors planning).
- [x] Test : suppression d'un médicament → stock supprimé (cascade).

## Étape 3 — Calcul exact du stock bas

Fonctions pures dans `src/features/stocks/utils/` (`now: Date` en paramètre, testées avec une heure fixée) :

- [x] Simulation prise par prise : prises du jour sans log puis jours suivants selon `days`, prises actives seulement. Renvoie le dernier jour entièrement couvert et le nombre de jours restants (exemple de la spec : 5 comprimés, 8h et 20h, lundi matin → mardi, 2 jours).
  - [x] Borne de simulation (ex. 9999 jours max) pour éviter une boucle infinie.
  - [x] Stock ≤ 0 → 0 jour, aujourd'hui non couvert.
- [x] Statut : `low` / `sufficient` / `noSchedule` (hors planning seul ou aucune prise) selon les règles de la spec (≤ seuil, ≤ 0 toujours bas).
- [x] Date de franchissement du seuil (date de fin − seuil), `undefined` si pas de seuil applicable.
- [x] Comprimés consommés sur les N prochains jours (texte d'aide).
- [x] Barre : stock ÷ taille de boîte, plafonnée entre 0 et 100 %.
- [x] Tests des cas limites : jours de la semaine variés, prise du jour déjà validée ou ignorée, médicament dans plusieurs prises, prise archivée, stock négatif, stock à 0, aucune prise.
- [x] Hook de lecture (ex. `hooks/useStocksData.ts`) : stocks + prises actives + logs du jour, statut calculé, relu au focus et à la minute (`useCurrentMinute`).

## Étape 4 — Écran Stock (liste)

- [x] `StocksScreen.tsx` : sections « Stock bas » (jours croissants) et « Suffisant », cartes du design (pilule, nom + force, comprimés, jours ou « Si besoin » / « Aucune prise prévue », barre, mention « Stock bas · jusqu'au 9 octobre »).
- [x] Composants dans `features/stocks/components/` (carte, section, état vide), formatage dans `utils/formatters.ts` (testé).
- [x] État vide du design avec le nouveau texte (spec) et le bouton « Stock d'un médicament ».
- [x] Bouton « Stock d'un médicament » en bas, aussi quand la liste n'est pas vide.
- [x] Carte : rôle bouton, libellé accessible complet (nom, comprimés, jours, statut).
- [x] Carte et bouton « Stock d'un médicament » : navigation branchée à l'Arrêt 2 (routes des étapes 6 et 7).
- [x] `StocksScreen.spec.tsx`.

## Étape 5 — Fixtures

- [x] `fixtures.ts` + `seed.ts` : stock pour les deux Lamictal (suffisant), Lithium en stock bas, aucun stock sur les autres.
- [x] Tests du seed à jour. `docs/database.md` si besoin.

- [x] `make tests` passe.
- [x] Tu vérifies sur l'iPhone : « Réinitialiser avec des données de test », onglet Stock : Lithium en stock bas, Lamictal suffisants, jours et dates corrects. État vide après « Supprimer les données ».

Je m'arrête et j'attends ta validation.

# Arrêt 2 — Ajouter, modifier, supprimer un stock

## Étape 6 — Sélecteur « Stock d'un médicament »

- [x] Route modale (ex. `src/app/stock/` avec `med-picker.tsx`, déclarée dans `_layout.tsx` comme `intake`).
- [x] Rendre la ligne « Nouveau médicament » de `MedPickerScreen` facultative ; mention « En stock » sans désactiver la ligne.
- [x] Sans médicament : texte de la spec + « Ouvrir le pilulier ».
- [x] Sélection → écran de modification du stock du médicament.
- [x] Tests RNTL.

## Étape 7 — Écran de modification du stock

- [x] Route modale (ex. `src/app/stock/index.tsx?medId=`), écran dans `features/stocks/` (ex. `StockEditScreen.tsx`), `Sheet` avec « Annuler » / « Enregistrer ».
- [x] Brouillon (ex. `utils/stockDraft.ts`, testé) : stock existant ou nouveau (0 comprimé, boîte 30, seuil = `lowStockDays` des Réglages).
- [x] En-tête : pilule, nom + force, sous-titre des heures (règle de la spec).
- [x] Carte du haut recalculée en direct (nombre, statut, « N jours, jusqu'au … », barre).
- [x] « Ajouter une boîte de N ».
- [x] « Comprimés restants » : `Stepper` + champ numérique (0–9999), valeur négative affichée telle quelle.
- [x] « Me prévenir à » (`Stepper` 1–30 jours) seulement si le seuil s'applique, aide « Soit N comprimés pour les N prochains jours. ».
- [x] « Taille d'une boîte » : champ numérique dans la ligne (1–999), erreur si vide ou hors bornes.
- [x] Modale d'abandon des modifications (`useModalClosing`, `DiscardChangesDialog`).
- [x] « Ne plus suivre le stock » (stock existant) : `Dialog` de confirmation, puis `deleteStock`.
- [x] Après enregistrement ou suppression : retour (la replanification des notifications est branchée à l'étape 12).
- [x] Accessibilité : labels des steppers (« Un comprimé de moins »…), Dynamic Type (`useFitsInWidth`), cibles ≥ 44 pt.
- [x] Tests RNTL : création, modification, boîte ajoutée, bornes, abandon, suppression.

## Étape 8 — Depuis « Modifier le médicament »

- [x] `MedScreen.tsx` (édition seulement) : bouton « Ajouter un stock » / « Modifier le stock ».
- [x] Ferme la modale sans confirmation, ouvre l'onglet Stock puis l'écran de modification du stock de ce médicament.
- [x] Tests RNTL : libellé selon l'existence du stock, absent pour un nouveau médicament.

- [x] `make tests` passe.
- [x] Tu vérifies sur l'iPhone : ajout du stock du Quviviq, taille de boîte, « Ajouter une boîte », seuil, abandon des modifications, suppression, bouton depuis « Modifier le médicament ».

Je m'arrête et j'attends ta validation.

# Arrêt 3 — Le stock vit avec les prises

## Étape 9 — Baisse du stock à la prise

- [x] `useIntakeValidation.ts` : pour `taken`, `insertIntakeLog` + `decreaseStocks` dans une seule transaction. Rien pour `skipped`.
- [x] `useAsNeededTaking.ts` : `take` → `insertMedLog` + baisse de 1 dans une transaction.
- [x] « Annuler » hors planning : supprime uniquement la dernière prise du jour (par `id`) et rend 1 comprimé, dans une transaction.
  - [x] Nouvelle requête (ex. `deleteLastMedLogOfDay`), `deleteMedLogsOfDay` supprimée si plus utilisée.
  - [x] Libellé accessible : « Annuler la prise de Lithium 250 mg de 15:40 » ; l'heure affichée passe à la prise précédente s'il en reste.
- [x] Les deux hooks remontent les médicaments passés sous zéro.
- [x] Tests : prise avec médicaments avec et sans stock, ignorée sans effet, annulation, passage sous zéro.
- [x] `e2e/as-needed.yaml` mis à jour (annulation d'une seule prise).

## Étape 10 — Modale « sous zéro » et bandeau sur Aujourd'hui

- [x] Modale (`Dialog`) sur `TodayScreen` quand une prise fait passer un ou plusieurs stocks sous zéro : texte au ton de l'app qui liste les médicaments, « Voir le stock » (onglet Stock) et « Plus tard ».
- [x] Bandeau stock bas (sur le modèle de `RemindersDisabledNotice`) : bouton vers l'onglet Stock, libellé accessible, affiché dès qu'un stock est bas.
- [x] Tests RNTL : modale affichée au franchissement seulement, bandeau visible ou non.

## Étape 11 — Badge de l'onglet Stock

- [x] Hook (ex. `useLowStockCount`) avec `useSyncExternalStore` + `subscribeToDatabaseChanges`, comme `usePendingPastIntakeCount`.
- [x] `(tabs)/_layout.tsx` : `badgeCounts.stocks`. `tabs.ts` : `formatBadgeLabel` (« 1 stock bas », « 2 stocks bas »).
- [x] Test du hook.

- [x] `make tests` passe.
- [x] Tu vérifies sur l'iPhone : prise validée ou ignorée et stock, hors planning pris puis annulé, passage sous zéro (modale), bandeau sur « Aujourd'hui », badge de l'onglet.

Je m'arrête et j'attends ta validation.

# Arrêt 4 — Notification de stock bas

## Étape 12 — Notification de stock bas

- [x] Fonction pure (ex. `features/notifications/utils/planLowStockAlerts.ts`) : une alerte par jour de franchissement, à 9h, seulement si dans le futur, corps qui liste les médicaments (formatter testé).
- [x] `planReminders` (ou une fonction d'assemblage) : rappels du jour, puis alertes de stock, puis rappels de demain, total ≤ 64.
- [x] `rescheduleReminders` lit les stocks. `resetReminders` planifie les alertes avec le son, sans `badge`.
- [x] Identifiant (ex. `low-stock-<date locale>`).
- [x] Nouveaux déclencheurs : enregistrement/suppression d'un stock, enregistrement d'une prise, prise hors planning et son annulation.
- [x] Tests : 9h passé, plusieurs médicaments le même jour, ordre et plafond de 64.
- [x] `docs/notifications.md` à jour (alertes de stock, ordre, déclencheurs).

- [x] `make tests` passe.
- [ ] Tu vérifies sur l'iPhone : stock qui franchit le seuil le lendemain, notification à 9h, rappels de prise toujours présents.

Je m'arrête et j'attends ta validation.

# Fin

## Étape 13 — Vérification

- [x] Accessibilité : contraste AA des nouvelles couleurs (rouge stock bas), Dynamic Type au maximum, ordre de lecture VoiceOver.
- [x] `make tests` passe.
- [ ] Tu vérifies sur l'iPhone (texte normal et agrandi, VoiceOver, notification de 9h).

## Étape 14 — E2E

- [x] `e2e/stocks.yaml` : ajouter un stock depuis la liste, valider une prise et voir le stock baisser, passer sous zéro (modale), supprimer le stock.
- [x] `make test-e2e` passe (si l'iPhone est branché : `maestro --device <simulator id> test e2e/`).

## Étape 15 — Fin

- [x] Docs à jour : `docs/database.md`, `docs/notifications.md`, `docs/architecture.md` (feature `stocks`) si besoin.
- [x] `make tests` passe.
- [x] Proposer une mise à jour de `CLAUDE.md` / docs si besoin (après ta validation seulement).
