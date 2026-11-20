# Récurrence avancée

Aujourd'hui, on peut configurer quand on prend une prise : tous les jours ou certains jours de la semaine.

Pour des cas précis, on aimerait une récurrence plus souple, par exemple donner un médicament à son enfant en garde partagée tous les jours, une semaine sur deux.

On a à peu près les mêmes options que dans le calendrier Apple (mais pas tout à fait identiques).

Le design est dans Claude Design : https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4#page-dcb81aee8d83, écrans « Pilulier · Quand prendre, une semaine sur deux », « Pilulier · Quand prendre, une fois par mois » et « Pilulier · Quand prendre, choix de la date ».

Modifications et ajouts par rapport au design :

- Dans la modale Prise (création / modification), on a maintenant « Tous les jours » ou « Personnalisé ».
- Dans la modale Prise, une fois la récurrence choisie, un libellé remplace « Tous les jours », par exemple : « Le 2 de chaque mois ».
- Les jours de la semaine disparaissent de la modale Prise.
- On affiche la prochaine prise dans la modale Prise et sur l'écran Pilulier (seulement pour les récurrences personnalisées).
- Avec une récurrence personnalisée, la date de début permet de choisir par exemple les semaines paires ou impaires.
- Dans le calendrier, on ne change rien à l'affichage.
- Le reste des écrans du design est validé.

## Décisions

### Modale Prise (création / modification)

- Section « Jours » : contrôle segmenté « Tous les jours | Personnalisé ». Les ronds Lu…Di disparaissent de cette modale.
- Appui sur « Personnalisé » : l'écran « Quand prendre mes médicaments » s'ouvre directement, prérempli en rythme « Jour », tous les jours cochés, à partir d'aujourd'hui.
- En « Personnalisé », une ligne avec chevron sous le segmenté affiche le résumé (ex. « Le 2 de chaque mois ») et « Prochaine : … ». Elle ouvre l'écran « Quand prendre mes médicaments ».

### Écran « Quand prendre mes médicaments »

- Empilé dans la modale Prise (retour « Prise de 20:30 »), sans bouton « Enregistrer » : le retour applique les choix au brouillon de la prise.
- Encadré récapitulatif (résumé + « À partir de … »), puis rythme « Jour / Semaine / Mois ».
- **Jour** : ronds Lu…Di seuls (équivalent des « certains jours » actuels), et date de début.
- **Semaine** : ronds Lu…Di + « Quelles semaines ? » : 1 sur 2 / 1 sur 3 / 1 sur 4 (pas de « Toutes », qui ferait doublon avec « Jour »). Aperçu sur 4 semaines (semaines actives et en pause), masqué aux lecteurs d'écran au profit d'un libellé de groupe (comme le design).
  - Les semaines commencent le lundi et se comptent depuis la semaine qui contient la date de début : c'est ce qui choisit les semaines paires ou impaires.
  - Les jours de cette première semaine qui tombent avant la date de début sont exclus.
- **Mois** : le jour du mois est celui de la date de début. « Quels mois ? » : Tous / 1 sur 2 / 1 sur 3 / 1 sur 6. Le 29, 30 ou 31 : les mois plus courts, ce sera le dernier jour du mois. Liste des 4 prochaines prises.
- « 1 jour sur N » : hors périmètre.
- **Date de début** (« À partir du ») :
  - Présente pour les trois rythmes.
  - Calendrier maison dépliable dans la ligne, comme le design (mois précédent / suivant, cases de 44 pt), en réutilisant la grille du mois de la feature calendrier. Identique iOS / Android, pas de nouvelle dépendance.
  - Aujourd'hui ou plus tard : jours passés grisés. Une prise existante garde sa date de début passée (pour ne pas décaler les semaines).
  - Avant cette date, la prise n'apparaît nulle part et ne sonne pas.

### Prochaine prise

- Aujourd'hui si la prise est prévue aujourd'hui et pas encore validée (aucun log), sinon la date prévue suivante.
- Affichée « aujourd'hui », « demain », sinon la date (« mercredi 2 décembre »).

### Écran Pilulier

- Carte d'une prise « Personnalisé » : sous l'heure, le résumé, puis « Prochaine : … », sans l'intervalle de rappel.
- Cartes « Tous les jours » : inchangées.

### Modale Stock

Modale Stock (ouverte depuis la carte Stock de l'écran détail Médicament), ligne grise sous le nom du médicament :

- Une prise « Tous les jours » : « 1 prise à 08:00 ».
- Une prise « Personnalisé » : « 1 prise à 22:00 », puis à la ligne le résumé (ex. « Toutes les 2 semaines, le mardi, mercredi et jeudi »).
- Plusieurs prises : « X prises ».
- Corrige au passage le bug actuel : les jours de la semaine n'y apparaissent pas.

### Ce qui suit la récurrence, sans changement d'interface

- Écran Aujourd'hui et rappels (notifications).
- Prévisions de stock et alertes de stock bas.
- Écran détail Médicament, liste des prises : le résumé remplace les jours.
- Calendrier : les statuts suivent la récurrence (une semaine en pause ou un jour hors du mois n'est pas un oubli). On n'affiche pas les prises futures, ni les prises récurrentes différemment.

### Données

- Table `intake` : on garde `days` (JSON des jours de la semaine, ignoré en `monthly`), on ajoute `frequency` (`daily` | `weekly` | `monthly`), `interval` (entier : 1, 2, 3…) et `starts_on` (date locale). Colonnes simples, lisibles depuis Swift (futur widget).
- Migration : prises existantes → `daily`, `interval` = 1, `starts_on` = `created_on`.
- Le filtre « prise prévue ce jour-là » devient une fonction pure TypeScript (`isIntakeDueOn`), au lieu du filtre SQL sur les jours de la semaine. À reproduire en Swift pour le widget.
- Modifier la récurrence d'une prise qui a un historique crée une nouvelle version (`saveIntake`), en gardant `starts_on`.

### Assurance qualité

- Tests Jest : jours prévus, résumés, prochaine prise, migration, prévisions de stock.
- Nouveau flow Maestro : créer une prise « 1 semaine sur 2 » et une « chaque mois », vérifier le résumé et la prochaine prise sur l'écran Pilulier.
- Données de test « Pilbo Dev » : une prise mensuelle et une prise une semaine sur deux, avec historique.
