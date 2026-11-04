# Onglet Médicaments

On veut transformer l'onglet « Stock » en armoire à pharmacie : l'onglet « Médicaments ».

Aujourd'hui :

- On ne peut créer ou modifier un médicament que depuis une prise ou le hors planning (Pilulier).
- On ne peut donc pas créer un médicament juste pour suivre son stock.
- Un médicament utile mais pas vital (ex. Doliprane) : on veut connaître son stock et pouvoir le prendre quand on veut, sans qu'il encombre « Aujourd'hui » comme un « Hors planning ».

L'onglet « Médicaments » liste tous les médicaments, vitaux ou non, avec ou sans stock, et permet de les prendre quand on veut, pas seulement depuis « Aujourd'hui ». Le Pilulier reste dédié au planning.

## Design

Le design est sur Claude Design, section « 5 · Médicaments » : https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4

- Liste (`med-list`), état vide (`med-list-empty`), section « Autres médicaments » d'« Aujourd'hui » (`today-others`), modale de prise libre (`free-take-edit`) : validés. Pour la liste, la maquette fait référence (voir Décisions > Liste).
- Fiche (`med-sheet-*`) : l'esprit est là, mais des ajustements sont à prévoir sur le simulateur (textes qui passent mal à la ligne, marges).
- Le code reste la référence pour les conventions de l'app :
  - titres de section : style existant (comme les Réglages), pas de capitales espacées ;
  - liens de suppression jamais en rouge (variante `text` de `Button`, comme « Supprimer cette prise »), même si certaines maquettes les montrent en rouge.

## Décisions

### Onglet

- L'onglet « Stock » devient **« Médicaments »** (« Meds » en anglais). Il tient dans la barre de l'iPhone 12 mini comme « Aujourd'hui » (rétrécissement automatique à 80 %), à vérifier sur l'appareil.
- Les 4 onglets restent : Aujourd'hui, Pilulier, Médicaments, Réglages. Le badge de stock bas reste sur cet onglet.
- La fiche est **empilée dans l'onglet** (comme le Calendrier dans « Aujourd'hui ») : `(tabs)/meds/index` (liste) et `(tabs)/meds/[medId]` (fiche), barre d'onglets visible, glissement retour iOS. Les écrans existants (médicament, apparence, stock, prise) restent des modales par-dessus.

### Fin de « Hors planning »

- La notion « Hors planning » **disparaît** : plus de section sur « Aujourd'hui » ni dans le Pilulier (ni le bouton de l'état vide du Pilulier). Tout médicament non planifié se prend depuis sa fiche.
- `is_as_needed` n'a plus d'usage. Les médicaments hors planning des testeurs restent dans l'onglet Médicaments, leurs prises (`med_log`) sont conservées.
- Le libellé « Si besoin » du calcul de stock est remplacé (médicament sans prise active : « Aucune prise prévue »).

### Liste

- **Une seule liste alphabétique**, compacte, pour gagner de la place. Disposition de la maquette `med-list` :
  - Pilule à gauche, nom + dosage au centre, avec « 84 cp » en petit sous le nom si les jours sont calculables.
  - À droite : « 28 jours » avec une petite jauge de stock dessous ; « 12 cp » seul si aucune prise prévue ; une mention discrète (ex. « Sans stock ») si le stock n'est pas suivi.
  - Simple séparateur entre les lignes.
  - Stock bas : couleur d'alerte **et icône** devant le nombre de jours (l'info ne passe pas par la couleur seule, WCAG 1.4.1), « stock bas » dans le libellé VoiceOver de la ligne. Plus de mention « Stock bas · jusqu'au… ». Le bandeau d'« Aujourd'hui » et le badge restent.
- Bouton du bas : « Nouveau médicament » (aussi dans l'état vide). Le sélecteur « Stock d'un médicament » disparaît : le stock s'ajoute depuis la fiche.
- « Nouveau médicament » ouvre l'écran médicament existant (modale). Après l'enregistrement, la modale se ferme et la nouvelle fiche s'ouvre.

### Fiche médicament

Écran de consultation avec des actions (pas un formulaire), qui réutilise les écrans existants. Bouton retour « Médicaments », pas de barre de navigation.

De haut en bas :

1. **En-tête** centré : la pilule en grand (badge crayon, un appui ouvre la personnalisation de l'apparence), le nom, le dosage, le détail.
   - Depuis la fiche, « Valider » sur l'écran Apparence **enregistre directement** en base et ferme ; « Annuler » ne change rien. Le comportement en brouillon reste inchangé dans le parcours prise.
2. **« Modifier »** juste sous l'en-tête : lien discret, pas un bouton normal (variante `text` de `Button`, icône crayon, zone tactile ≥ 44 pt). Il ouvre l'écran médicament existant (nom, dosage, détail, apparence).
   - Le bouton « Ajouter / Modifier le stock » de l'écran médicament est **retiré partout** (parcours prise compris) : le stock se gère depuis la fiche.
3. **« Prendre 1 comprimé »** (uniquement sur la fiche, pas sur les lignes de la liste), toujours actif (pas d'état « Pris » désactivé) :
   - bouton **principal** si le médicament n'est dans aucune prise active (ex. Doliprane) ;
   - bouton **secondaire** s'il est planifié (ex. Lithium) : prendre en plus est l'exception.
4. **Ligne du jour**, sous le bouton :
   - « 3 comprimés aujourd'hui · dernier à 15:40 » : prises libres et prises planifiées validées, quantités comprises ;
   - sans prise aujourd'hui : « Dernière prise : hier à 15:40 » (ou la date) ;
   - jamais pris : ligne masquée ;
   - un appui ouvre le jour concerné (« Aujourd'hui » ou `day/[date]`).
5. **« Annuler »** : lien qui apparaît sous la ligne du jour juste après un appui sur « Prendre ». Pas de minuterie ni de notification temporaire (accessible à VoiceOver).
   - Chaque appui annule la dernière prise libre **faite pendant cette visite de la fiche** (par identifiant) et rend le comprimé au stock. Après 2 appuis sur « Prendre », 2 annulations sont possibles.
   - Le lien disparaît quand il ne reste plus de prise de cette visite à annuler, ou quand on quitte la fiche. Les prises plus anciennes se suppriment depuis « Aujourd'hui ».
6. Section **« Stock »** : une ligne, un appui ouvre l'écran de stock existant.
   - Planifié : « 45 jours, jusqu'au 18 décembre », « 90 comprimés » et la barre. Couleur d'alerte en stock bas.
   - Non planifié : « 15 comprimés » et « Pas d'estimation en jours : ce médicament n'est pas planifié ».
   - Stock non suivi : « Suivre le stock ».
7. Section **« Dans le pilulier »** : une ligne par prise active qui contient le médicament (« 08:00 · Tous les jours · 1 comprimé »), un appui ouvre la prise. Section **masquée** si le médicament n'est dans aucune prise.
8. **« Supprimer le médicament »** en bas, lien non rouge (voir Archivage).

Toutes les sections suivent le même modèle (titre de section puis groupe de lignes). Le mot « prise » désigne l'action de prendre : pas de « Aucune prise prévue » sur la fiche.

### Prendre un médicament

- Une prise depuis la fiche vaut **toujours 1 comprimé** : pour en prendre 2, on appuie 2 fois. Pas de quantité dans `med_log`.
- Si le médicament est dans une prise active, une **modale de confirmation** s'affiche avant d'enregistrer, pour éviter une prise en double. Par exemple : « Ce médicament est prévu dans la prise de 08:00. Le prendre quand même ? », boutons « Prendre quand même » / « Annuler ».
- Enregistrée dans `med_log`, le stock baisse de 1 (même transaction).
- Après l'enregistrement :
  - annonce VoiceOver (ex. « Doliprane 500 mg pris à 15:40 ») ;
  - si le stock passe sous zéro, la modale existante `StocksBelowZeroDialog` s'affiche ; « Voir le stock » ouvre l'écran de stock de ce médicament.
- Sur la fiche, la ligne du jour se met à jour et le lien « Annuler » apparaît (voir Fiche médicament).
- Ces prises s'affichent sur « Aujourd'hui » et les jours passés, **une carte par prise** (2 Doliprane = 2 cartes), triées par heure, dans une section **« Autres médicaments »** en bas.
- Une carte est modifiable comme une prise planifiée (spec 20) : modale avec l'heure de prise et « Supprimer cette prise ».
  - « Supprimer cette prise » : **sans confirmation**. La prise est supprimée, le comprimé rendu au stock, la modale se ferme, annonce VoiceOver.

### Modale « sous zéro »

- Le texte ne cite plus l'onglet « Stock » : « Pensez à mettre à jour les quantités dans Médicaments. »
- Depuis « Aujourd'hui » (validation d'une prise planifiée), « Voir le stock » ouvre l'onglet Médicaments.

### Archivage

- « Supprimer le médicament » sur la fiche, avec modale de confirmation.
- Le médicament est **archivé** : il disparaît de la liste et des sélecteurs, son stock est supprimé, l'historique du calendrier est conservé.
- Impossible s'il est dans une prise active : message qui indique la prise concernée.
- La détection de doublon **ignore les médicaments archivés** : créer « Doliprane 500 mg » alors qu'un « Doliprane 500 mg » est archivé crée un nouveau médicament ; l'ancien reste archivé avec son historique.

### Données

- Une seule colonne d'archivage sur `med` : `archived_on` (date locale, nulle si le médicament est actif), et le retrait de `is_as_needed`, dans la migration en cours. Les données des testeurs doivent être conservées.
- Relire le SQL généré : le retrait de `is_as_needed` doit être un `ALTER TABLE … DROP COLUMN`. Une recréation de la table `med` supprimerait les stocks en cascade.
- Mettre à jour la section **Schéma** de `docs/database.md`.

### Organisation du code

- Nouvelle feature `features/meds/` (liste et fiche), namespace i18n `meds`.
- `features/stocks/` garde l'écran de stock, les prévisions et le badge. `StocksScreen` et `StockMedPickerScreen` sont supprimés.

### Assurance qualité

- **Test Jest de migration** : base en mémoire migrée en `0000`, données insérées (dont un médicament hors planning avec stock et prises), puis migration en cours appliquée : données conservées.
- Flows Maestro : `as-needed.yaml` et `stocks.yaml` remplacés par des flows Médicaments.
- Données de test (variante dev) mises à jour : un médicament non planifié avec stock, un médicament sans stock.
