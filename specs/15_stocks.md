# Stocks

On veut intégrer l'écran et la fonctionnalité des stocks.

L'écran stock est sur Claude Design, sous "4 · Stock et réglages" (Réglage est déjà fait) : https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4#page-dcb81aee8d83

On a aussi un "empty state" dans la partie "Vide · Stock, aucun médicament" (mais le bouton n'est pas le bon).

Le stock représente la quantité d'un médicament (Nom + Force) qu'il nous reste à l'instant T.

## Fonctionnement

### Stock facultatif

Le stock d'un médicament est toujours facultatif, et pas actif par défaut. Certain•e•s utilisateurices ne voudront pas utiliser la fonctionnalité, ou sur certains médicaments seulement.

### Ajout d'un stock

Il ne peut pas être saisi à la création d'un médicament. À la modification d'un médicament par contre, on peut avoir un bouton "Ajouter un stock" qui dirigera vers l'ajout / la modification du stock de ce médicament là.

Depuis l'écran de stock, on a toujours (même en empty state) un bouton "Stock d'un médicament" qui affiche un écran absent du design, mais qui ressemblera à la liste des médicaments à ajouter à une prise. C'est comme ça qu'on peut ajouter le stock de n'importe quel médicament. On voit depuis cette liste les médicaments déjà en stock. Quoi qu'il arrive (déjà en stock ou pas) on arrive sur l'écran de modification du stock.

La taille de la boîte doit être flexible, certaines boîtes ont 28 comprimés par exemple, il faut donc un écran de saisie.

### Vue des stocks

Rien à redire à l'écran "Liste", il fonctionne bien. Juste à rajouter le bouton comme exprimé ci-dessus.

### Baisse du stock

À chaque prise validée (et pas ignorée) on réduit le stock de la quantité individuelle de chaque médicament de la prise.

C'est aussi le cas des médicaments "Hors planning".

Il ne se passe rien si un médicament qui n'a pas de stock associé a une prise (attention, un médicament sans stock peut être avec un médicament qui a du stock dans la même prise).

Si on réduit le stock en dessous de 0, la première fois on affichera une modale d'avertissement ("Votre stock est tombé en dessous de zéro, pensez à mettre à jour les quantités dans Stock", par exemple), puis on affichera -1 et ainsi de suite, c'est à l'utilisateurice de remettre le bon stock par elle-même.

### Suppression d'un stock

Si on ne veut plus suivre le stock, on peut supprimer un médicament du stock, de manière définitive (avec une modale de confirmation de suppression).

### Avertissement sur Aujourd'hui, badges

On affichera un léger avertissement sur l'écran « Aujourd'hui » quand n'importe lequel des stocks est trop bas, c'est un bouton vers l'écran stock. Exemple : « Le stock d'un de vos médicaments est trop bas, pensez à le renouveler ».

On affichera aussi un badge sur l'onglet stock.

### Notification

Une unique notification de stock bas sera envoyée à 9h le jour où l'on a franchi le seuil de stock bas, si plusieurs médicaments sont concernés le même jour, on fera une seule notification, avec les médicaments concernés, comme c'est le cas pour la notification pilbo.

Ces notifications suivent le même fonctionnement que pilbo, il faut donc les empiler avec les notifications de prise dans la limite de 64 notifications, on créera les notifications du jour, puis les notifications des alertes de stock, et enfin les notifications des jours suivants si il en reste.

### Fixtures

On modifiera un peu les données de tests :

- Du stock pour les lamictal, tous en stock.
- Du stock pour le lithium, en stock bas.
- Aucun stock sur les autres médicaments, pour pouvoir tester l'ajout.

Je te laisse décider des détails des fixtures, ce n'est pas très important.

## Décisions

### Calcul du stock bas

- Seuil de stock bas **en jours, propre à chaque médicament** (« Me prévenir à N jours », comme le design). À la création du stock, il est prérempli avec « Stock bas par défaut » des Réglages (`lowStockDays`). Modifier ce réglage ne change pas les stocks existants.
- **Calcul exact, jamais une moyenne** (un décalage d'un jour peut être grave) : on simule les prises à venir une par une, en retirant leur quantité du stock.
  - Prises du jour pas encore validées (ni prises, ni ignorées), puis jours suivants selon les jours de la semaine de chaque prise.
  - Prises actives uniquement (les prises archivées ne comptent pas).
  - Les prises ignorées par le passé ne comptent pas (pas d'historique utilisé).
- « Jusqu'au » = **dernier jour entièrement couvert**. Exemple : lundi matin, 5 comprimés, 2 par jour (8h et 20h) → lundi et mardi couverts, mercredi 8h couvert mais pas 20h → « jusqu'au mardi », 2 jours.
- Stock bas dès que les jours restants ≤ seuil.
- Médicament **hors planning seul** (ou dans aucune prise active) : pas de stock bas, pas de jours restants. Affiché « Si besoin » (hors planning) ou « Aucune prise prévue » (ni prise, ni hors planning).
- Médicament **dans une prise et aussi hors planning** : seuil en jours calculé sur les prises. Ses prises hors planning baissent le stock, donc avancent la date du stock bas.
- **Stock ≤ 0 = toujours stock bas** (liste, bandeau, badge), même hors planning seul. Pas de notification dans ce cas (pas de date prévisible).

### Écran de modification du stock

- Design : « Stock · Stock normal » et « Stock · Stock bas ».
- Enregistrement explicite, comme l'édition de prise : « Annuler » / « Enregistrer », modale « abandonner les modifications » si changements non enregistrés. Le stock n'existe en base qu'après « Enregistrer ».
- La carte du haut (nombre, statut, jours, date, barre) se recalcule en direct avec les valeurs en cours de saisie.
- « Comprimés restants » : stepper + champ comme le design. Saisie de 0 à 9999. Nouveau stock à 0. Une valeur négative venue des prises s'affiche telle quelle jusqu'à correction.
- « Taille d'une boîte » : champ numérique directement dans la ligne (pas de chevron, pas de sous-écran), obligatoire, de 1 à 999, 30 par défaut pour un nouveau stock.
  - Bouton « Ajouter une boîte de N » : ajoute N au nombre affiché (enregistré avec le reste).
  - Barre de progression : stock ÷ taille de boîte, plafonnée à 100 %.
- Sous-titre sous le nom : heures des prises (« Prises de 08:30 et 20:30 »). Le nombre de comprimés par jour n'est ajouté que s'il est identique tous les jours de prise.
- Textes adaptés au calcul exact :
  - « 28 jours, jusqu'au 1er novembre » (sans « Environ »).
  - Aide sous le seuil : « Soit 21 comprimés pour les 7 prochains jours. » (comprimés exacts consommés sur les N prochains jours).
- Le stepper « Me prévenir à » n'est affiché que si le seuil s'applique (médicament dans une prise active).
- « Ne plus suivre le stock » en bas de l'écran (stock existant uniquement), avec modale de confirmation, suppression définitive.

### Liste, ajout, état vide

- Bouton « Stock d'un médicament » en bas de l'écran, comme les autres boutons de l'app, aussi dans l'état vide (à la place de « Ouvrir le pilulier »).
- Texte de l'état vide : « Suivez le stock d'un médicament : Pilbo vous préviendra avant que vous en manquiez. »
- Le design « Vide · Stock à renseigner » n'est pas repris.
- Tri : « Stock bas » par jours restants croissants, puis « Suffisant ».
- Sélecteur « Stock d'un médicament » (modale, reprend le sélecteur des prises) :
  - Tous les médicaments, mention « En stock » sur ceux déjà suivis, toujours sélectionnables → écran de stock.
  - Pas de ligne « Nouveau médicament ».
  - Sans aucun médicament : « Ajoutez d'abord un médicament dans le pilulier. » + bouton « Ouvrir le pilulier ».
- Dans « Modifier le médicament » (modale de prise ou hors planning) : bouton « Ajouter un stock », ou « Modifier le stock » s'il existe. Il ferme la modale sans confirmation (les modifications en cours sont perdues) et ouvre l'écran de stock depuis l'onglet Stock. Absent pour un nouveau médicament.

### Baisse du stock

- La baisse se fait dans la même transaction que l'enregistrement de la prise (planifiée ou hors planning). Une prise hors planning compte pour 1 comprimé.
- **Changement du hors planning** : « Annuler » sur « Aujourd'hui » n'annule plus toutes les prises du jour, mais seulement la dernière, et rend 1 comprimé au stock.
- Modale « sous zéro » sur « Aujourd'hui » quand une prise fait passer un stock de ≥ 0 à < 0 :
  - Pas de nouvelle modale pour −1 → −2. Si le stock est corrigé puis repasse sous zéro, elle revient. Rien n'est mémorisé en base.
  - Plusieurs médicaments : une seule modale qui les liste.
  - Boutons « Voir le stock » et « Plus tard ».

### Avertissements

- Bandeau sur « Aujourd'hui » uniquement, bouton vers l'écran Stock.
- Badge de l'onglet Stock : nombre de stocks bas, libellé accessible (« 1 stock bas », « 2 stocks bas »).

### Notification

- À 9h le jour du franchissement du seuil (date de fin − seuil), une notification par jour concerné (plusieurs médicaments le même jour = une seule, qui les liste).
- Si 9h est déjà passé ce jour-là : pas de notification, l'avertissement dans l'app suffit. Rien n'est mémorisé en base, tout est recalculé à chaque replanification.
- Texte : titre « Stock bas », corps « Lithium 250 mg, Lamictal 50 mg : pensez à les renouveler. ». Même son que les rappels, sans modifier le badge de l'icône.
- Ordre dans la limite des 64 : rappels du jour, puis alertes de stock, puis rappels des jours suivants.
- Replanification aussi après l'enregistrement ou la suppression d'un stock, l'enregistrement d'une prise, et une prise hors planning (ou son annulation).

### Données

- Nouvelle table `stock` (simple à lire depuis Swift) :
  - `med_id` : clé primaire → `med.id`, supprimée avec le médicament (`cascade`).
  - `quantity` : peut être négatif.
  - `box_size`.
  - `low_stock_days`.
- Pas de stock = pas de ligne.

### Assurance qualité

- Jest : calcul exact avec une heure fixée, requêtes, notifications.
- Maestro `e2e/stocks.yaml` : ajouter un stock depuis la liste, valider une prise et voir le stock baisser, passer sous zéro (modale), supprimer le stock.
- Vérification sur l'iPhone : VoiceOver, texte agrandi, notification de 9h.
