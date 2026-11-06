# Spec 26 — Onglet Médicaments

## Contexte

L'onglet « Stock » devient « Médicaments » : liste de tous les médicaments, fiche par médicament (prendre, stock, pilulier, archivage), fin de la notion « Hors planning ». Les prises libres apparaissent sur « Aujourd'hui » dans « Autres médicaments ». Spec et décisions : `specs/26_meds_tab.md`.

À lire avant de commencer :

- `CLAUDE.md` (stack, règle des migrations, accessibilité, ton), `docs/architecture.md`, `docs/database.md`.
- Maquettes (Claude Design, section « 5 · Médicaments ») : https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4 — fichiers `project/med-list.dc.html`, `med-list-empty.dc.html`, `med-sheet-bare.dc.html`, `med-sheet-doliprane.dc.html`, `med-sheet-low.dc.html`, `med-sheet-large.dc.html`, `today-others.dc.html`, `free-take-edit.dc.html` (lecture avec l'outil Artifact, action `read` + `paths`).
- Code existant :
  - Base : `src/shared/database/schema.ts`, `migrations/` (`0000` livrée sur TestFlight, figée), `fixtures.ts`, `seed.ts`, `testDatabase.ts`.
  - Médicaments : `src/domain/med.ts` (`Med.isAsNeeded`), `features/pillbox/queries/medRecord.ts` (`selectMeds`, `toMed`), `getAllMeds.ts`, `getMedById.ts`, `findDuplicateMed.ts`, `insertMed.ts`, `updateMed.ts`, `getAsNeededMeds.ts`, `setMedAsNeeded.ts`, `hooks/useMedActions.ts`, `hooks/useMedDraft.tsx`, `utils/medDraft.ts` (`MedFlowOrigin`, détail « Si besoin »).
  - Écrans réutilisés : `features/pillbox/MedScreen.tsx`, `AppearanceScreen.tsx`, `MedPickerScreen.tsx`, `IntakeEditScreen.tsx`, `features/stocks/StockEditScreen.tsx`, `features/today/IntakeLogEditScreen.tsx` (spec 20, modèle de la modale de prise libre).
  - Hors planning : `src/app/as-needed/*`, `features/pillbox/components/UnscheduledSection.tsx`, `UnscheduledMedRow.tsx`, `RemoveAsNeededDialog.tsx`, `PillboxEmptyState.tsx`, `PillboxScreen.tsx`, `hooks/usePillboxData.ts`, `features/today/components/AsNeededSection.tsx`, `AsNeededMedRow.tsx`, `TakenAsNeededSection.tsx`, `TakenAsNeededRow.tsx`, `TodayContent.tsx`, `PastDayContent.tsx`, `hooks/useAsNeededTaking.ts`, `hooks/useTodayData.ts`, `queries/getDayData.ts`, `getMedLogsOfDay.ts`, `getLastMedLogsOfDay.ts`, `deleteLastMedLogOfDay.ts`, `insertMedLog.ts`, `utils/todayTypes.ts`.
  - Stock : `features/stocks/StocksScreen.tsx`, `StockMedPickerScreen.tsx`, `components/StockCard.tsx`, `StockProgressBar.tsx`, `StocksBelowZeroDialog.tsx`, `utils/formatters.ts` (`noScheduleText`, `formatStocksBelowZeroMessage`), `utils/stockForecast.ts`, `utils/stockSections.ts`, `utils/medSchedule.ts`, `utils/openStock.ts`, `queries/getStocksData.ts`, `getAllStocks.ts`, `decreaseStocks.ts`, `increaseStock.ts`, `deleteStock.ts`, `hooks/useLowStockCount.ts`.
  - Navigation : `src/app/_layout.tsx` (modales), `src/app/(tabs)/_layout.tsx`, `(tabs)/stocks.tsx`, `(tabs)/today/_layout.tsx` (modèle de pile dans un onglet), `shared/navigation/tabs.ts`, `design-system/components/TabBar`, `design-system/components/Icon/iconShapes.tsx`.
  - E2E : `e2e/as-needed.yaml`, `stocks.yaml`, `low-stock-notice.yaml`, `language.yaml`, `pillbox.yaml`.

## Étape 1 — Schéma et migration

- `schema.ts` : `medTable` gagne `archivedOn: text("archived_on")` (nullable), perd `isAsNeeded`.
- [x] `make db-generate`, relire le SQL : `ALTER TABLE med ADD archived_on` et `ALTER TABLE med DROP COLUMN is_as_needed`, **aucune recréation de `med`** (sinon `stock` serait vidé en cascade, voir spec > Données). Corriger à la main si besoin.
- [x] Test Jest de migration (`src/shared/database/migrations.spec.ts` ou à côté de `testDatabase.ts`) : base en mémoire migrée jusqu'à `0000`, insertion d'un médicament planifié, d'un hors planning (`is_as_needed = 1`) avec stock, `med_log`, `intake`, `intake_med`, `intake_log` ; migration en cours appliquée ; toutes les lignes conservées, `archived_on` nul. Ajouter dans `testDatabase.ts` l'option nécessaire pour migrer jusqu'à une migration donnée.
- [x] `docs/database.md` : section Schéma (`med.archived_on`, retrait de `is_as_needed`, `med_log` = « prises libres », plus de « hors planning ») et exemples de requêtes qui citent `isAsNeeded`.

## Étape 2 — Domaine et requêtes médicaments

- [x] `domain/med.ts` : retirer `isAsNeeded` de `Med` ; adapter tous les tests et helpers qui le fournissent (`testIntakes.ts`, `testStocks.ts`, specs listées par `grep -rn isAsNeeded src`).
- [x] `medRecord.ts` : `selectMeds` ne renvoie que les médicaments actifs (`archived_on IS NULL`) par défaut ; `getMedById` renvoie aussi un archivé (historique), à trancher selon les appelants.
- [x] `findDuplicateMed` : ignore les archivés (spec > Archivage).
- [x] Nouvelle requête `archiveMed(database, medId, today)` : dans une transaction, supprime le stock et pose `archived_on`. Refus (résultat typé) si le médicament est dans une prise active, avec les prises concernées.
- [x] Nouvelle requête `updateMedDesign(database, medId, design)` (apparence enregistrée directement depuis la fiche).
- [x] Supprimer `getAsNeededMeds`, `setMedAsNeeded` (+ specs).
- [x] Tests Jest de chaque requête (base en mémoire).

## Étape 3 — Fin du hors planning

- Pilulier :
  - [x] `PillboxScreen` : retirer `UnscheduledSection` ; état vide = aucune prise.
  - [x] `PillboxEmptyState` : retirer le bouton hors planning.
  - [x] Supprimer `UnscheduledSection`, `UnscheduledMedRow`, `RemoveAsNeededDialog`, `AsNeededMedPickerScreen`, `AsNeededMedScreen`, `AsNeededAppearanceScreen`, `src/app/as-needed/` et sa déclaration dans `src/app/_layout.tsx`.
- Écran médicament :
  - [x] `MedFlowOrigin` : `"intake" | "meds"` ; plus de détail prérempli « Si besoin » ; libellé d'ajout pour `meds` : « Ajouter » ou « Enregistrer » (à aligner sur la maquette `med-new`).
  - [x] Retirer le bouton « Ajouter / Modifier le stock » (et `useHasStock` s'il n'a plus d'usage) et « Enlever de « Hors planning » ».
- Aujourd'hui :
  - [x] Retirer `AsNeededSection`, `AsNeededMedRow`, `useAsNeededTaking`, `asNeededMeds` de `getDayData` / `useTodayData`, `getLastMedLogsOfDay` et `deleteLastMedLogOfDay` s'ils n'ont plus d'usage.
- Stock :
  - [x] `formatters.ts` : `noScheduleText` → « Aucune prise prévue » seul (plus de « Si besoin »).
- [x] `fixtures.ts` : plus de `isAsNeeded` ; Doliprane non planifié avec stock, un médicament sans stock (spec > Assurance qualité) ; quelques `med_log` sur ~45 jours conservés.
- [x] `make i18n-extract` : clés « Hors planning » retirées (FR/EN).

## Étape 4 — Onglet et navigation

- [x] `src/app/(tabs)/stocks.tsx` → `src/app/(tabs)/meds/_layout.tsx` (pile, comme `today/_layout.tsx`), `meds/index.tsx` (liste), `meds/[medId].tsx` (fiche).
- [x] `(tabs)/_layout.tsx` : `Tabs.Screen name="meds"`, badge `meds: useLowStockCount()`.
- [x] `shared/navigation/tabs.ts` : clé `meds`, libellé « Médicaments » / « Meds », icône de la maquette `med-list` (trousse, à ajouter dans `iconShapes.tsx`).
- [x] Remplacer les `router.navigate("/stocks")` (`TodayContent`, `openStock.ts`) par `/meds`.
- [x] Routes modales ajoutées dans `src/app/_layout.tsx` (`presentation: "modal"`) :
  - `src/app/med/` (`_layout.tsx` avec `MedDraftProvider`, `index.tsx` = `MedScreen` origine `meds`, `appearance.tsx` = apparence en brouillon) ;
  - apparence directe depuis la fiche (ex. `src/app/med-appearance.tsx`, paramètre `medId`) ;
  - modale de prise libre (ex. `src/app/med-log.tsx`, paramètre `medLogId`).
- [x] Supprimer `StocksScreen`, `StockMedPickerScreen`, `src/app/stock/med-picker.tsx`, `StocksEmptyState`, `StockSection`, `stockSections.ts` (+ specs) s'ils n'ont plus d'usage.
- [ ] Tu vérifies sur l'iPhone que « Médicaments » tient dans la barre (12 mini).

## Étape 5 — Liste (`features/meds/MedsScreen.tsx`)

- [x] Hook `useMedsData` : médicaments actifs triés (`sortMeds`), stock et prévision (`computeStockForecast`), relu au focus.
- [x] Composant de ligne d'après `med-list` (spec > Liste) : pilule, nom + dosage, « 84 cp » sous le nom si jours calculables, à droite « 28 jours » + jauge (réutiliser `StockProgressBar` ou une variante compacte), « 12 cp » seul, ou « Non suivi ».
  - Stock bas : couleur d'alerte + icône `alert`.
  - Libellé VoiceOver complet (nom, jours, comprimés, « stock bas »), rôle bouton.
  - Dynamic Type : `useFitsInWidth` pour empiler la partie droite si elle ne tient pas.
- [x] Bouton « Nouveau médicament » en bas, état vide d'après `med-list-empty` (illustration, texte, même bouton).
- [x] Formatters purs dans `features/meds/utils/formatters.ts` (namespace `meds`), testés.
- [x] `MedsScreen.spec.tsx` : tri, trois cas d'affichage, stock bas, état vide, navigation.

## Étape 6 — Fiche : consultation (`features/meds/MedSheetScreen.tsx`)

- [x] Hook `useMedSheetData(medId)` : médicament, stock + prévision, prises actives qui le contiennent, prises du jour et dernière prise.
- [x] Requête de la ligne du jour (testée) : quantité prise aujourd'hui (`med_log` + `intake_log` « taken » × `intake_med.quantity` de la version) et dernière prise (aujourd'hui ou avant), voir spec > Fiche médicament point 4.
- Composants, d'après `med-sheet-*` :
  - [x] Bouton retour « Médicaments » (pas de barre de navigation).
  - [x] En-tête : pilule en grand + badge crayon (→ apparence directe), nom, dosage, détail.
  - [x] Lien « Modifier » (`Button` variante `text`, icône `pencil`) → `/med?medId=`.
  - [x] Ligne du jour (masquée si jamais pris), appui → « Aujourd'hui » ou `/day/[date]`.
  - [x] Section « Stock » : 3 cas (spec point 6), appui → `/stock?medId=`.
  - [x] Section « Dans le pilulier » (masquée si vide) : « 08:00 · Tous les jours · 1 comprimé », appui → `/intake?intakeId=`.
  - [x] « Supprimer le médicament » (variante `text`, pas rouge).
- [x] Titres de section au style des Réglages (`SettingsSection` ou équivalent).
- [x] Si le médicament n'existe plus ou est archivé : retour à la liste.
- [x] Tests : affichage des cas (non planifié, planifié, stock bas, sans stock, jamais pris).

## Étape 7 — Fiche : prendre et annuler

- [x] « Prendre 1 comprimé » : principal si aucune prise active, secondaire sinon.
- [x] Planifié : `Dialog` de confirmation (« Ce médicament est prévu dans la prise de 08:00. Le prendre quand même ? », plusieurs heures jointes avec « et »).
- [x] Prise : transaction `insertMedLog` + `decreaseStocks` (quantité 1), haptique, annonce VoiceOver, `rescheduleAfterChange()`, relecture.
- [x] `StocksBelowZeroDialog` : « Voir le stock » ouvre `/stock?medId=`.
- [x] « Annuler » : pile locale des identifiants `med_log` créés pendant la visite ; chaque appui supprime le dernier (nouvelle requête `deleteMedLog(database, medLogId)` + `increaseStock` en transaction), annonce VoiceOver ; lien masqué quand la pile est vide. Icône retour à ajouter dans `iconShapes.tsx` (maquette) ou pas d'icône.
- [x] Tests : confirmation, stock −1 / +1, annulations successives, modale sous zéro.

## Étape 8 — Fiche : apparence, modification, création, archivage

- [x] Apparence directe : `AppearanceScreen` accepte un mode où « Valider » appelle `updateMedDesign` puis ferme (le mode brouillon reste inchangé).
- [x] « Modifier » : `MedScreen` origine `meds`, enregistrement puis fermeture ; la fiche se relit au focus.
- [x] « Nouveau médicament » : `MedScreen` origine `meds` ; après l'enregistrement, fermer la modale et ouvrir `/meds/[medId]` du nouveau médicament.
- [x] Archivage : `Dialog` de confirmation, `archiveMed`, retour à la liste, `rescheduleAfterChange()` (alertes de stock). Refus : `Dialog` qui indique la prise concernée (ex. « Ce médicament est dans la prise de 08:00. Retirez-le du pilulier d'abord. »).
- [x] Tests : apparence enregistrée, création → fiche, archivage accepté / refusé, doublon d'un archivé accepté.

## Étape 9 — « Autres médicaments » sur Aujourd'hui et les jours passés

- [x] Section « Autres médicaments » en bas d'« Aujourd'hui » et de `PastDayContent` (remplace `TakenAsNeededSection`) : une carte par `med_log`, triées par heure (`getMedLogsOfDay`), d'après `today-others` ; appui → modale de prise libre.
- [x] `getDayData` / `useTodayData` : `medLogs` du jour ; état vide d'« Aujourd'hui » cohérent quand il n'y a que des prises libres.
- [x] Modale de prise libre (`features/today/MedLogEditScreen.tsx`, d'après `free-take-edit` et `IntakeLogEditScreen`) : en-tête pilule + nom + date, heure de prise (`DatePicker`), « Supprimer cette prise » sans confirmation (supprime, +1 au stock, annonce, ferme), « Annuler » / « Enregistrer », `useModalClosing` + `DiscardChangesDialog`.
- [x] Requête `updateMedLogTime` (testée).
- [x] Tests : section, édition de l'heure, suppression.

## Étape 10 — Textes

- [x] `formatStocksBelowZeroMessage` : « Pensez à mettre à jour les quantités dans Médicaments. »
- [x] Nouveau namespace `meds` (`i18next.config.ts`, `i18next.d.ts`, resources) ; `make i18n-extract` ; traductions EN.
- [x] Ton de l'app (vouvoiement, phrases courtes) relu sur tous les nouveaux textes.

## Étape 11 — E2E

- [x] Supprimer `e2e/as-needed.yaml` et `e2e/stocks.yaml`.
- [x] Nouveaux flows : liste → nouveau médicament → fiche → suivre le stock → prendre → annuler ; médicament planifié → confirmation ; prise libre visible sur « Aujourd'hui » → modification de l'heure → suppression ; archivage refusé puis accepté.
- [x] Mettre à jour `language.yaml`, `low-stock-notice.yaml`, `pillbox.yaml` (onglet « Médicaments », plus de hors planning).
- [x] `make test-e2e` passe.

## Étape 12 — Fin

- [x] Simulateur : fiche en Dynamic Type grand (`med-sheet-large`), mode sombre, ajustements de marges et retours à la ligne (spec > Design).
- [ ] `make tests` passe.
- [x] Proposer une mise à jour de `CLAUDE.md` / docs (ex. `docs/architecture.md` : feature `meds`, namespace `meds`) : après ta validation seulement.
