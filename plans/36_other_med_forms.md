# Spec 36 — Autres formes : sachet, tube, sirop, gouttes

## Contexte

On ajoute 4 formes dessinées dans Claude Design (« Composants » › « Autres formes, variante penchée »), en version penchée, avec deux couleurs. Spec et décisions : `specs/36_other_med_forms.md`.

| Forme         | Couleur 1                                 | Couleur 2                                  |
| ------------- | ----------------------------------------- | ------------------------------------------ |
| Sachet (15°)  | centre                                    | les deux bords dentelés                    |
| Tube (40°)    | tube (corps + sertissage)                 | bouchon                                    |
| Sirop (25°)   | liquide (reste à niveau, vague)           | flacon + bouchon                           |
| Gouttes (30°) | liquide dans la pipette + goutte (droite) | pipette entière : poire, collerette, verre |

Pas de migration : `design` est stocké en JSON.

## Étapes

- [x] **1. Domaine** : `src/domain/med.ts`, ajouter `"sachet" | "tube" | "syrup" | "drops"` à `PillShape` et à `PILL_SHAPES` (`hasScoreLine: false`). Mettre à jour `med.spec.ts`.
- [x] **2. Composants SVG** (`src/design-system/components/Pill/`) : `SachetPill`, `TubePill`, `SyrupPill`, `DropsPill`, tracés exacts du design, rotation propre à chaque forme. Sirop : `ClipPath` à identifiant unique (`useId`). Brancher dans `Pill.tsx`.
- [x] **3. Couleurs par défaut sirop / gouttes** (`pillDesign.ts`) : `withShape` vers sirop ou gouttes d'un design à une seule couleur → `[couleur, blanc]`, interrupteur synchronisé sur « Deux couleurs ». `randomPillDesign` : couleur 2 blanche pour ces formes. Tests.
- [x] **4. i18n** : « sachet », « tube », « sirop », « gouttes » (EN : sachet, tube, syrup, drops). Tests `formatters.spec.ts`.
- [x] **5. Écran Apparence** : 10 formes, affichage iPhone 12 mini et grand texte. Mettre à jour `AppearanceScreen.spec.tsx`. Grille gardée à 3 colonnes (cases vides en fin de ligne).
- [x] **6. Fixtures** : Quviviq en sirop et Prégabaline en sachet dans `fixtures.ts` (ajouter des médicaments casserait les tests qui les comptent).
- [x] **7. `make tests`** puis vérification visuelle sur le simulateur.
- [x] **8. Expérience splash / icône (à valider)** : les 4 formes dans les pilules du fond de `scripts/generateArtwork.mjs` (gélule héros inchangée), `make artwork`, captures avant / après. Sans validation : retour aux fichiers d'origine. → Non retenue pour l'instant : splash et icône d'origine conservés.
