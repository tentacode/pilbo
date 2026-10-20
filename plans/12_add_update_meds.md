# Spec 12 — Ajout et modification de médicament

## Contexte

Créer, modifier et supprimer des prises. Créer et modifier des médicaments (apparence comprise). Gérer les médicaments hors planning dans le Pilulier et dans Aujourd'hui. Spec et décisions : `specs/12_add_update_meds.md`.

À lire avant de commencer :

- `CLAUDE.md`, `docs/architecture.md`, `docs/database.md`, `docs/notifications.md`.
- Design (Claude Design) : `https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4`, artboards `project/pilulier.dc.html`, `project/prise-edit.dc.html`, `project/med-picker.dc.html`, `project/med-new.dc.html`, `project/pill-editor-c.dc.html`, `project/Main.dc.html` (détail sous le nom : classe `.md`), styles `project/pilbo.css` (`.sheet`, `.grab`, `.nav`, `.navbtn`, `.navttl`, `.group`, `.row`, `.field`, `.seg`, `.days`, `.dayb`, `.stepper`, `.sbtn`, `.addrow`, `.plus-dot`, `.chip-val`, `.btn-t`, `.sheet-foot`, `.prev`, `.shapes`, `.halves`, `.swatches`, `.swb`, `.slider`, `.thumb`). Lecture via l'outil Artifact, action `read` avec `path`.
- Code existant :
  - Routes : `src/app/_layout.tsx` (`Stack.Protected`), `src/app/(tabs)/_layout.tsx`, `src/app/(tabs)/pillbox.tsx`.
  - Domaine : `src/domain/med.ts` (`PillDesign`, `Med`, `compareMeds`), `src/domain/intake.ts`, `src/domain/intakeLog.ts` (`toLocalDate`, `toLocalDateTime`).
  - Base : `src/shared/database/schema.ts`, `fixtures.ts`, `seed.ts`, `testDatabase.ts`, `testHelpers.ts`, `database.ts` (`subscribeToDatabaseChanges`), migrations.
  - Pilulier : `src/features/pillbox/PillboxScreen.tsx`, `hooks/usePillboxData.ts`, `queries/getAllIntakes.ts`, `queries/getAsNeededMeds.ts`, `queries/medRecord.ts`, `components/` (`IntakeCard`, `IntakeMedRow`, `UnscheduledSection`, `UnscheduledMedRow`, `AddMedRow`, `PillboxEmptyState`, `OverlappingPills`), `utils/sorters.ts`, `utils/formatters.ts`.
  - Aujourd'hui : `src/features/today/TodayScreen.tsx`, `components/TodayHeader.tsx` (bouton « Si besoin »), `components/TodayMedList.tsx`, `queries/getTodayIntakes.ts`, `hooks/useTodayData.ts`, `hooks/useIntakeValidation.ts` (modèle Prendre / Annuler).
  - Notifications : `src/features/notifications/rescheduleReminders.ts`.
  - Design system : `Pill/` (`Pill.tsx`, `RoundPill`, `OvalPill`, `CapsulePill`, `Pill.styles.ts`), `Button`, `IconButton`, `Icon/iconShapes.tsx`, `Text`, `Screen`, `ScreenHeader`, `hooks/useAccessibilityFocusOnMount.ts`, `hooks/useReduceMotion.ts`, `utils/playPressHaptic.ts`, `tokens.ts`.
  - Tests : `jest.setup.ts`, `e2e/*.yaml`.
- Mémoire : jamais de header de navigation (Stack `headerShown: false`). Reanimated `entering`/`exiting` perdent les translations en Release : utiliser des shared values.

Une validation sur simulateur à la fin de chaque écran (étapes 3 à 9), et à chaque étape importante de l'apparence (étape 10).

## Étape 1 — Données

- Domaine `src/domain/med.ts` :
  - [x] `PillShape` : `"round" | "oval" | "capsule" | "softgel"`.
  - [x] `PillDesign` : `{ shape, size, colors: [string, string] }`, 2 couleurs pour toutes les formes (identiques = unie). Anciennes données à 1 couleur relues comme unies (`toMed`).
  - [x] `PILL_SHAPES` : configuration par forme (`hasScoreLine` : vrai pour `round` et `oval`), pour ajouter une forme facilement.
  - [x] `Med.detail: string` (vide si absent).
  - [x] `formatMedLabel(med)` : « Lithium 250 mg », ou « Lithium » sans dosage (utilisé dans les libellés d'accessibilité et la modale de doublon).
  - [x] Tests `med.spec.ts` à jour.
- Schéma `src/shared/database/schema.ts` :
  - [x] `med.detail` : `text("detail").notNull().default("")`.
  - [x] Table `med_log` : `id`, `medId` (FK `med.id`, `restrict`), `takenAt` (date locale, format de `toLocalDateTime`).
  - [x] Types `MedLogRow` / `NewMedLogRow`.
  - [x] `make db-generate`, vérifier le SQL généré.
- [x] `fixtures.ts` et `seed.ts` au nouveau format (`colors`, `detail` sur 1 ou 2 médicaments, ex. « Avec le repas »).
- [x] `queries/medRecord.ts`, `getAllIntakes.ts`, `getAsNeededMeds.ts`, `features/today/queries/getTodayIntakes.ts` : lire `detail`.
- Design system `Pill/` :
  - [x] `SoftgelPill.tsx` (ellipse + reflet, cf. `pill-editor-c.dc.html`, forme « Capsule molle »).
  - [x] `RoundPill` et `OvalPill` : barre de sécabilité toujours affichée. Toutes les formes prennent `colors` (moitiés : haut/bas pour Rond, gauche/droite pour les autres).
  - [x] `Pill.tsx` : passe au nouveau format.
- [x] `docs/database.md` : section **Schéma** (`med.detail`, `med_log`, format `design`), et note « base à vider après cette migration (réinstaller l'app) ».
- [x] `make tests` passe.

## Étape 2 — Briques transverses

- `src/design-system/components/Dialog/` (`Dialog.tsx` + styles) :
  - [x] `Modal` RN transparent, fond assombri, carte centrée : picto optionnel (`Icon`), titre, message, 1 ou 2 actions (`Button`).
  - [x] `accessibilityViewIsModal`, titre `accessibilityRole="header"` focus à l'ouverture (`useAccessibilityFocusOnMount`), pas d'animation si « Réduire les animations ».
  - [x] Ajouter les icônes manquantes dans `iconShapes.tsx` (ex. `trash`, `pencil`, `alert`, `close`).
  - [x] Test RNTL : rendu, actions appelées.
- `src/design-system/components/Stepper/` (`Stepper.tsx` + styles) :
  - [x] Props : `value`, `min`, `max`, `onChange`, `onRemove?` (si fourni, le « − » devient une corbeille à `min`), libellés d'accessibilité en props.
  - [x] `accessibilityRole="adjustable"` sur la valeur (`increment` / `decrement`), boutons ≥ 44 pt.
  - [x] Test RNTL : bornes 1 et 10, corbeille à 1.
- `src/design-system/components/SegmentedControl/` (`.seg` du design) :
  - [x] `accessibilityRole="radiogroup"` / `radio` + `accessibilityState.selected`.
- `src/design-system/components/Sheet/` (en-tête de feuille : `.grab` + `.nav` avec bouton gauche, titre, bouton droit optionnel, pied `.sheet-foot` collé en bas) :
  - [x] Titre `accessibilityRole="header"`. Dynamic Type sans hauteur fixe.
- [x] Tokens manquants dans `tokens.ts` (couleurs `.sheet`, `.group`, `.field`…), contraste AA vérifié.
- [x] `make tests` passe.

## Étape 3 — Routes et Pilulier branché

- Routes (aucun header, cf. mémoire) :
  - [x] `src/app/_layout.tsx` : dans le `Stack.Protected guard={onboardingDone}`, ajouter `intake` et `as-needed` en `presentation: "modal"`.
  - [x] `src/app/intake/_layout.tsx` : `IntakeDraftProvider` + `Stack` (`index`, `med-picker`, `med`, `appearance`).
  - [x] `src/app/as-needed/_layout.tsx` : `MedDraftProvider` + `Stack` (`med-picker`, `med`, `appearance`).
  - [x] Chaque route réexporte l'écran de `features/pillbox` (cf. `docs/architecture.md`). Les écrans `MedPickerScreen`, `MedScreen` et `AppearanceScreen` sont communs aux deux parcours, avec un paramètre `origin: "intake" | "asNeeded"`.
- `PillboxScreen.tsx` :
  - [x] « + » de l'en-tête → `/intake` (nouvelle prise). `IntakeCard` → `/intake?intakeId=…`.
  - [x] État vide : « Créer une prise » → `/intake`, « Ajouter un médicament hors planning » → `/as-needed/med-picker`.
  - [x] Section « Si besoin » renommée « Hors planning » (`UnscheduledSection`). `AddMedRow` → `/as-needed/med-picker`. `UnscheduledMedRow` → `/as-needed/med?medId=…`.
  - [x] `usePillboxData` : relecture au retour de la modale (le `useFocusEffect` actuel suffit-il ? sinon `subscribeToDatabaseChanges`).
- [x] Tests RNTL `PillboxScreen.spec.tsx` à jour (navigation mockée).
- [x] `make tests` passe.

## Étape 4 — Modifier une prise

- Requêtes `src/features/pillbox/queries/` (+ tests sur base en mémoire) :
  - [x] `getIntakeById(database, intakeId)`.
  - [x] `saveIntake(database, draft)` : insertion ou mise à jour sur place (même id), en transaction : `intake` puis remplacement des lignes `intake_med`.
  - [x] `archiveIntake(database, intakeId)` : `isArchived = true`.
- `src/features/pillbox/hooks/useIntakeDraft.tsx` : contexte + provider :
  - [x] Brouillon : `time`, `days`, `reminderIntervalMinutes`, `medQuantities`. Nouvelle prise : 08:00, tous les jours, 10 min.
  - [x] Actions : `setTime`, `setDays`, `setReminderInterval`, `addMed`, `setQuantity`, `removeMed`, `isDirty`.
- `src/features/pillbox/utils/validators.ts` (+ tests) :
  - [x] `validateIntakeDraft` : au moins 1 médicament ; « Certains jours » → au moins 1 jour ; quantité de 1 à 10.
- [x] Sélecteur d'heure : `DatePicker` de `@expo/ui/swift-ui` (déjà installé, `@react-native-community/datetimepicker` abandonné), mock Jest dans `jest.setup.ts`.
- `src/features/pillbox/IntakeEditScreen.tsx` + `components/` :
  - [x] Titre « Nouvelle prise » ou « Prise de HH:MM ». « Annuler » à gauche.
  - [x] Ligne « Heure » : `DatePicker` `hourAndMinute`, style `compact`, locale `fr-FR`.
  - [x] « Jours » : `SegmentedControl` « Tous les jours » / « Certains jours » + boutons jours (`Lu`…`Di`, `accessibilityLabel` « Lundi »…, `accessibilityState.selected`).
  - [x] « Répéter le rappel toutes les » : 5, 10, 15, 30 min + aide « Jusqu'à ce que vous preniez ou ignoriez la prise. ».
  - [x] « Médicaments » : lignes (pilule, nom + dosage, `Stepper` 1 à 10 avec corbeille à 1) + « Ajouter un médicament » → `med-picker` (lignes remplacées : étape 7).
  - [x] « Supprimer cette prise » (variante `text`, pas en rouge, seulement en modification) → `Dialog` de confirmation → `archiveIntake`.
  - [x] « Enregistrer » : `validateIntakeDraft` (message d'erreur lisible sinon), `saveIntake`, fermeture.
  - [x] Après enregistrement et suppression : `rescheduleReminders(database, new Date())` (erreur en console seulement).
  - [x] Changements non enregistrés : `usePreventRemove` (React Navigation, vérifier l'export côté Expo Router) → `Dialog` « Abandonner les modifications ? » (Abandonner / Continuer). Glisser vers le bas bloqué (`gestureEnabled: !isDirty`).
- [x] Tests RNTL : création, modification, validation, suppression, abandon.
- [x] `make tests` passe.
- [x] Tu vérifies sur le simulateur.

Je m'arrête et j'attends ta validation.

## Étape 5 — Ajouter un médicament (picker)

- [x] Requête `getAllMeds(database)` (+ test), tri via `sortMeds` (`utils/sorters.ts`).
- `src/features/pillbox/MedPickerScreen.tsx` + `components/` :
  - [x] Titre « Ajouter un médicament », « Annuler » à gauche. Pas de recherche.
  - [x] « Nouveau médicament » → `med` (création).
  - [x] « Vos médicaments » : liste alphabétique dans un `ScrollView`, pilule, nom + dosage, détail en dessous.
  - [x] `origin="intake"` : médicament déjà dans le brouillon → grisé, « Dans la prise », non sélectionnable (`accessibilityState.disabled`). Sinon tap → `addMed` (quantité 1) et retour.
  - [x] `origin="asNeeded"` : déjà hors planning → grisé, « Déjà hors planning ». Sinon tap → `setMedAsNeeded(medId, true)` et fermeture de la modale.
- [x] Requête `setMedAsNeeded(database, medId, isAsNeeded)` (+ test).
- [x] Tests RNTL des deux parcours.
- [x] `make tests` passe.
- [x] Tu vérifies sur le simulateur.

Je m'arrête et j'attends ta validation.

## Étape 6 — Écran médicament (créer / modifier)

- Requêtes (+ tests) :
  - [x] `getMedById`, `insertMed`, `updateMed`.
  - [x] `findDuplicateMed(database, { name, strength, excludedMedId? })` : comparaison exacte après `trim()`.
- `src/features/pillbox/hooks/useMedDraft.tsx` : contexte + provider partagé par `MedScreen` et `AppearanceScreen` :
  - [x] `name`, `strength`, `detail`, `design`. Apparence par défaut à la création (ex. Rond, moyenne, Lilas). Détail « Si besoin » par défaut en `origin="asNeeded"`.
  - [x] Dans `intake/_layout.tsx`, `MedDraftProvider` est imbriqué sous `IntakeDraftProvider` (réinitialisé à chaque ouverture de `med`).
- `src/features/pillbox/MedScreen.tsx` + `components/` :
  - [x] Titre « Nouveau médicament » ou « Modifier le médicament ». « Retour » (picker) ou « Annuler » à gauche.
  - [x] Bloc apparence : grand aperçu (bouton), description (« Gélule · moyenne · … »), « Modifier l'apparence » → `appearance` (écran provisoire jusqu'à l'étape 10).
  - [x] Champs : « Nom », « Dosage (facultatif) » en texte libre, « Détail (facultatif) ». Libellés liés aux champs pour VoiceOver.
  - [x] `origin="intake"` en création : pas de quantité (ajouté avec une quantité de 1, réglable dans la prise). Bouton « Ajouter à la prise ».
  - [x] `origin="asNeeded"` : pas de quantité. Bouton « Ajouter au hors planning » (création, `isAsNeeded = true`) ou « Enregistrer ». En modification : « Enlever de "Hors planning" » → `Dialog` → `setMedAsNeeded(false)` → fermeture.
  - [x] Enregistrement immédiat en base : nom vide → erreur sur le champ ; doublon → `Dialog` « Votre médicament Lithium 250 mg existe déjà » (`formatMedLabel`).
  - [x] Parcours prise : après création → `addMed` au brouillon (quantité 1), retour à la prise. Après modification → brouillon mis à jour (nom, apparence…).
- [x] Tests RNTL : création (deux parcours), modification, doublon (création et modification), nom vide.
- [x] `make tests` passe.
- [x] Tu vérifies sur le simulateur.

Je m'arrête et j'attends ta validation.

## Étape 7 — Actions sur une ligne médicament de la prise

- `components/IntakeMedEditRow.tsx` (+ styles) :
  - [x] Indice visuel cliquable : petit chevron (le crayon était peu clair).
  - [x] Tap sur la ligne → feuille d'actions native iOS (`hooks/useMedRowActionSheet.ts`, `ActionSheetIOS`) : « Modifier le médicament », « Retirer de la prise », « Annuler ». Remplace les boutons dans la ligne (trop de place sur un petit écran).
  - [x] VoiceOver : feuille native, gérée par iOS (focus et retour du focus).
  - [x] « Modifier le médicament » → `med?medId=…`. « Retirer de la prise » → `removeMed`.
  - [x] Animation : celle de la feuille native (respecte « Réduire les animations »).
- [x] Tests RNTL : feuille affichée, actions (`ActionSheetIOS` espionné).
- [x] `make tests` passe.
- [x] Tu vérifies sur le simulateur (avec VoiceOver).

Je m'arrête et j'attends ta validation.

## Étape 8 — Hors planning dans le Pilulier

- [x] Parcours complet : ajout d'un médicament existant, création, modification, « Enlever de "Hors planning" ».
- [x] Un même médicament peut être dans une prise et hors planning.
- [x] `e2e/pillbox.yaml` : adapter « Si besoin » → « Hors planning ».
- [x] `make tests` passe.
- [x] Tu vérifies sur le simulateur.

Je m'arrête et j'attends ta validation.

## Étape 9 — Aujourd'hui

- Détail :
  - [x] `TodayMedList` (et cartes compactes si pertinent) : détail sous le nom (`.md` du design), en `small` / `secondary`.
- Section « Hors planning » :
  - [x] Requêtes `features/today/queries/` (+ tests) : `insertMedLog(database, medId, now)`, `deleteMedLogsOfDay(database, medId, localDate)`, `getLastMedLogsOfDay(database, localDate)` (dernier `takenAt` par médicament). Médicaments via `getAsNeededMeds` du Pilulier.
  - [x] `useTodayData` : ajoute les médicaments hors planning et leur dernière prise du jour.
  - [x] `components/AsNeededSection.tsx` + `AsNeededMedRow.tsx` (+ styles) : titre « Hors planning », une ligne par médicament (pilule, nom + dosage, détail), « Prendre » ; après une prise : « Pris à HH:MM », « Prendre » et « Annuler ».
  - [x] « Prendre » : haptique de succès (`playSuccessHaptic`). « Annuler » : efface toutes les prises hors planning du jour pour ce médicament.
  - [x] Section affichée en bas, même avec l'état vide ou « tout est pris ». Non comptée dans « X prises sur Y » ni dans le badge.
  - [x] Retirer le bouton « Si besoin » de `TodayHeader` (et `handleAddUnscheduled`).
- [x] Tests RNTL `TodayScreen.spec.tsx`, `TodayHeader.spec.tsx` à jour + section hors planning.
- [x] `make tests` passe.
- [x] Tu vérifies sur le simulateur.

Je m'arrête et j'attends ta validation.

## Étape 10 — Apparence

### 10.1 — Forme et taille

- `src/features/pillbox/AppearanceScreen.tsx` + `components/` :
  - [x] Titre « Apparence », « Annuler » à gauche, « Valider » en pied (met à jour `useMedDraft`).
  - [x] Aperçu grand format (`accessibilityLabel` : « Aperçu : gélule moyenne, … ») + ligne d'aperçu (nom + dosage, et à la place de « Au coucher » : l'heure de la prise ou « Hors planning »).
  - [x] « Forme » : 4 boutons radio (Rond, Ovale, Gélule, Capsule molle), générés depuis `PILL_SHAPES`. Changer de forme garde les deux couleurs.
  - [x] « Taille » : `SegmentedControl` Petite / Moyenne / Grande.
- [x] Tests RNTL.
- [x] `make tests` passe.
- [x] Tu vérifies sur le simulateur.

Je m'arrête et j'attends ta validation.

### 10.2 — Nuancier

- [x] « Couleur 1 » / « Couleur 2 » (`.halves`), pour toutes les formes.
- [x] Nuancier : Blanc, Jaune, Rose, Lilas, Bleu ciel, Menthe (valeurs du design en tokens) + « Autre couleur » (dégradé conique). Radios accessibles avec le nom de la couleur.
- [x] Tests RNTL.
- [x] `make tests` passe.
- [x] Tu vérifies sur le simulateur.

Je m'arrête et j'attends ta validation.

### 10.3 — Couleur libre (curseurs)

- `src/design-system/utils/color.ts` (+ tests) : fonctions pures génériques :
  - [x] `colorFromHueAndIntensity(hue, intensity)` → hex. Teinte pastel (0 à 360). Intensité de 0 (blanc) à 100 (« noir clair »), en passant par le pastel au milieu.
  - [x] `hueAndIntensityFromColor(hex)` pour positionner les curseurs sur une couleur existante.
  - [x] Dégradés des pistes (teinte à intensité fixe, intensité à teinte fixe).
- `src/design-system/components/ColorSlider/` (+ styles) :
  - [x] Piste en dégradé SVG, pastille de la couleur courante, geste avec `react-native-gesture-handler` (`Pan` + `Tap`, `runOnJS(true)` : la valeur passe par l'état React, pas de shared value nécessaire). `GestureHandlerRootView` ajouté à la racine (`src/app/_layout.tsx`).
  - [x] `accessibilityRole="adjustable"`, `accessibilityValue`, actions `increment` / `decrement` (pas de 5 %), cible ≥ 44 pt.
  - [x] Test RNTL : actions d'accessibilité.
- [x] « Autre couleur » affiche le panneau Teinte + Intensité, appliqué à la couleur sélectionnée (Couleur 1 ou 2).
- [x] `make tests` passe.
- [x] Tu vérifies sur le simulateur (avec VoiceOver).

Je m'arrête et j'attends ta validation.

## Étape 11 — Maestro

- [x] `e2e/intake-edit.yaml` : créer une prise (nouveau médicament + quantité), la modifier (heure, jours, quantité), la supprimer.
- [x] `e2e/as-needed.yaml` : ajouter un médicament hors planning, le prendre dans Aujourd'hui (« Pris à »), annuler.
- [x] Flows existants à jour (`pillbox.yaml`, `today.yaml`, `today-validation.yaml`).
- [x] `make test-e2e` passe.

## Étape 12 — Vérifications sur iPhone

- [ ] Tu réinstalles l'app (base vidée, nouveau format) : `make build-device`.
- [ ] Tu vérifies les rappels après création, modification et suppression d'une prise.
- [ ] Tu vérifies VoiceOver, Dynamic Type, « Réduire les animations » sur tous les nouveaux écrans.

## Reporté

- Aujourd'hui, section « Hors planning » : après « Prendre », la ligne « Pris à … · Annuler » s'ajoute sous le médicament et peut passer sous la barre d'onglets si on est en bas de l'écran. Pistes : défilement automatique, ou « Pris à » à la place du détail et « Annuler » à côté de « Prendre ».

## Étape 13 — Fin

- [ ] `make tests` passe.
- [ ] Proposer une mise à jour de `CLAUDE.md` / `docs/architecture.md` (routes modales, contextes de brouillon, `Dialog`) / `docs/database.md` si besoin (après ta validation seulement).
