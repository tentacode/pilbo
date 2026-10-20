# Ajout et modification de médicament

On va s'attaquer à un gros morceau : les écrans d'ajout et de modification de médicaments.

Le design est toujours dans : https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4#page-dcb81aee8d83, dans la section « 3 · Pilulier ».

La variante sélectionnée pour le design des pilules est « Pilulier · Apparence C, nuancier + couleur libre », avec les modifications suivantes :

- le curseur d'intensité doit pouvoir aller du blanc au noir (ça peut être un « noir clair » pour respecter la palette pastel).
- « Au coucher » est remplacé par l'heure de la prise (ou « Hors planning »).

D'autres modifications par rapport au design :

- Dans « Pilulier · Nouveau médicament », le champ dosage est un champ libre, le sélecteur d'unité disparaît, le dosage est facultatif.
- Dans « Pilulier · Nouveau médicament », on a un champ détail. Il n'est pas implémenté dans l'écran « Aujourd'hui » : à implémenter.
- Dans « Pilulier · Ajouter un médicament », pas de champ de recherche : on affiche juste la liste par ordre alphabétique, avec un défilement si besoin.
- Les médicaments hors planning ont une variante de l'écran médicament, sans heure, jours, rappel ni quantité. Par défaut, le champ détail contient « Si besoin ». À intégrer dans « Aujourd'hui ».
- Dans « Pilulier · Modifier une prise », le lien supprimer n'est pas en rouge. On affiche une modale de confirmation (pas de design), simple, avec un picto si nécessaire.
- Pas de design pour le sélecteur d'heure dans « Pilulier · Modifier une prise » : on utilise le sélecteur natif iOS.

Règles de validation :

- On ne peut pas créer une prise sans médicament, on ne peut pas sélectionner un médicament déjà dans la prise.
- On ne peut pas avoir deux médicaments avec le même nom et le même dosage (ex. : Lithium et Lithium, tous les deux sans dosage, ou Lithium 250 mg et Lithium 250 mg). On affiche une modale d'erreur à l'enregistrement du médicament, du genre « Votre médicament Lithium 250 mg existe déjà ».
- La quantité d'un médicament dans une prise va de 1 à 10.

Chaque écran devra être validé, on suivra un ordre logique pour que je puisse le tester via simulateur.

L'écran de design de pilule sera probablement le plus complexe à implémenter, on le fera à la fin, avec validation pour chaque étape importante.

## Décisions

### Modèle de données

- Un médicament est **agnostique** : il existe en base, indépendamment des prises. « Hors planning » est un simple drapeau (`isAsNeeded`), combinable avec les prises : n'importe quel médicament peut être hors planning, même s'il est déjà dans une prise.
- Nouveau champ `detail` (texte facultatif) sur le médicament.
- Format de l'apparence (`design`) revu :
  - 4 formes : `round` (Rond), `oval` (Ovale), `capsule` (Gélule), `softgel` (Capsule molle). Modèle extensible : d'autres formes viendront plus tard.
  - `colors` : toujours 2 couleurs, pour toutes les formes (une moitié chacune, identiques pour une pilule unie). Pour mettre un peu de fun, même si c'est loufoque. Des motifs (damier…) viendront plus tard.
  - `hasScoreLine` supprimé : la barre de sécabilité est toujours affichée pour Rond et Ovale.
- Nouvelle table `med_log` (`medId`, `takenAt`) pour les prises hors planning. Schéma simple (lu plus tard depuis Swift par le widget).
- Pas de conversion des données existantes : on accepte de vider la base (réinstallation de l'app). Le seed et les fixtures passent au nouveau format.
- Mettre à jour la section **Schema** de `docs/database.md`.

### Pilulier

- Le « + » de l'en-tête ouvre « Nouvelle prise ». Les boutons de l'état vide (« Créer une prise », « Ajouter un médicament hors planning ») sont branchés.
- La section « Si besoin » est renommée « Hors planning » (comme le design).
- « Ajouter un médicament » (section Hors planning) ouvre le picker partagé.
- Un tap sur une ligne hors planning ouvre l'écran médicament (variante hors planning).

### Modifier une prise

- Heure : `DatePicker` de `@expo/ui` (SwiftUI) en mode compact (pastille « 20:30 » qui ouvre la roue iOS). `@react-native-community/datetimepicker` abandonné : il ne compile pas avec React Native précompilé.
- Nouvelle prise, valeurs par défaut : 08:00, tous les jours, rappel toutes les 10 min.
- Intervalles de rappel : 5, 10, 15, 30 min (comme le design).
- Ligne médicament :
  - Indice visuel qu'elle est cliquable : petit chevron (pas de « … »).
  - Au tap, feuille d'actions native iOS (`ActionSheetIOS`) : « Modifier le médicament », « Retirer de la prise », « Annuler ». Choisie à la place des boutons dans la ligne, trop encombrants sur un petit écran.
  - Stepper de 1 à 10. À 1, le « − » devient une corbeille qui retire le médicament de la prise.
- Validation à l'enregistrement : au moins 1 médicament ; si « Certains jours », au moins 1 jour.
- « Supprimer cette prise » (pas en rouge) → modale de confirmation → la prise est archivée (`isArchived`), l'historique est conservé.
- « Annuler » ou glisser vers le bas avec des changements non enregistrés → modale « Abandonner les modifications ? » (Abandonner / Continuer). Le glisser vers le bas est bloqué tant qu'il y a des changements. Sans changement : fermeture directe.
- Une prise modifiée garde son id (modification sur place) : une prise déjà validée aujourd'hui reste « Pris ». Limite acceptée : l'historique passé affiche les médicaments actuels.
- Les notifications sont reprogrammées après l'enregistrement et après la suppression d'une prise.

### Ajouter un médicament (picker partagé prises / hors planning)

- Pas de recherche. « Nouveau médicament » en haut, puis tous les médicaments par ordre alphabétique, avec défilement.
- Un médicament déjà dans la prise (« Dans la prise ») ou déjà hors planning (« Déjà hors planning ») est grisé et non sélectionnable.
- Un tap sur un autre médicament l'ajoute (quantité 1 pour une prise) et revient à l'écran précédent.

### Écran médicament (créer / modifier)

- Champs : apparence, nom (obligatoire), dosage (libre, facultatif), détail (facultatif).
- Nom : première lettre mise en majuscule à l'enregistrement (le reste est conservé tel quel), clavier en majuscule de début de phrase.
- Le médicament est enregistré en base **immédiatement** (« Ajouter à la prise », « Ajouter au hors planning » ou « Enregistrer »). Si on annule ensuite la prise, le nouveau médicament reste dans la liste du picker.
- Une modification de médicament s'applique partout où il est utilisé.
- Doublon : même nom et même dosage, comparaison **exacte** après retrait des espaces de début et de fin (la casse et les accents comptent). Vérifié aussi en modification (en excluant le médicament lui-même). Modale d'erreur « Votre médicament Lithium 250 mg existe déjà ».
- Depuis une prise : pas de quantité à la création, le médicament est ajouté à la prise avec une quantité de 1 (réglable ensuite dans la prise).
- Variante hors planning : pas de quantité, détail « Si besoin » par défaut à la création, lien « Enlever de "Hors planning" » (avec confirmation) en modification.
- Pas de suppression de médicament dans cette spec.

### Aujourd'hui

- Le détail du médicament est affiché sous son nom dans les cartes (comme le design).
- Nouvelle section « Hors planning » en bas de l'écran, une ligne par médicament hors planning :
  - « Prendre » enregistre une prise dans `med_log`. On peut prendre un médicament plusieurs fois par jour.
  - Après une prise, la ligne reste à sa place avec « Pris à HH:MM » (la dernière prise du jour), « Prendre » toujours disponible, et « Annuler ».
  - « Annuler » efface toutes les prises hors planning du jour pour ce médicament.
  - Les prises hors planning ne comptent pas dans « X prises sur Y ».
- Le bouton « Si besoin » de l'en-tête est retiré.

### Apparence (en dernier, validation à chaque étape importante)

- Design C : formes (les 4), taille (Petite, Moyenne, Grande), nuancier + « Autre couleur », choix Couleur 1 / Couleur 2 pour toutes les formes.
- Curseurs Teinte et Intensité faits maison dans le design system (gesture-handler + Reanimated, fond dégradé SVG, pastille colorée), `accessibilityRole="adjustable"` pour VoiceOver.
- Intensité : du blanc au « noir clair ».
- Aperçu : « Au coucher » remplacé par l'heure de la prise, ou « Hors planning ».

### Composants transverses

- Modale de dialogue générique dans le design system (confirmation, erreur), avec picto. Utilisée pour : supprimer une prise, abandonner les modifications, doublon, retirer du hors planning.

### Ordre et validation

Une validation sur simulateur par écran, dans cet ordre :

1. Données (migration, domaine, seed).
2. Pilulier branché + « Modifier une prise ».
3. Picker.
4. Écran médicament (création, modification, doublons).
5. Actions sur une ligne médicament (ligne remplacée, corbeille).
6. Hors planning dans le Pilulier.
7. Aujourd'hui (détail + section hors planning).
8. Apparence, avec validation à chaque étape importante.

### Tests

- Jest : requêtes (repositories), règles de validation, fonctions de couleur, écrans.
- Maestro : créer, modifier et supprimer une prise ; prendre et annuler un médicament hors planning.
