# Proof of concept utilisable

Dans `specs/02_notification_proof_of_concept.md`, on a fait une proof of concept de plusieurs notifications, avec un son custom. Commit : `2407997c561488836823f1955a9f8489b82d92e8`.

Aux étapes précédentes, on a mis en place la base de données et l'écran « Aujourd'hui » (ainsi que le Pilulier et quelques ajustements, sans rapport avec cette spec).

Dans cette spec, on veut une proof of concept brute mais fonctionnelle, que je peux utiliser. Elle n'a pas besoin d'être finie ni prête pour des utilisateurs, juste testable dans la vraie vie :

- Je reçois les notifications à l'heure de la prise.
- J'ai un rappel toutes les 10 minutes, jusqu'à ce que je valide la prise.
- Je peux valider la prise, et les notifications s'arrêtent.

Tout le reste est optionnel (ex. les médicaments à la demande comme le prazépam sont hors scope). Le but est de tester les notifications en conditions réelles.

Les fixtures contiennent déjà des prises réalistes.

Le code doit être concis, simple plutôt que complexe, lisible, et respecter toute la documentation du projet.

Les questions se posent une par une, pas toutes en même temps.

## Tâches

- [ ] Créer la table `intake_log` et ses types :
  - `id`
  - `intake_id` : clé étrangère vers `intake` (`restrict`)
  - `expected_intake_at` : jour et heure prévus de la prise (on ne peut pas se fier à l'heure de la prise, elle peut changer)
  - `created_at` : moment réel de l'appui sur le bouton
  - `status` : `"taken"` ou `"skipped"` pour l'instant
- [ ] Ajouter la colonne `is_archived` à la table `intake`.
- [ ] Ajouter un log de fixture à la date du jour : la prise du matin est « prise, en retard », les autres prises sont laissées telles quelles. Si ma base n'est plus à jour, je peux la réinitialiser depuis les Réglages.
- [ ] Sur l'écran « Aujourd'hui », afficher l'état des prises du jour :
  - Lire en base les `intake_log` attendus à la date du jour.
  - Sans log : la prise est à venir, ou en retard si l'heure prévue est passée (les boutons restent utilisables).
  - Avec un log : afficher la prise selon son statut, et si elle a été prise en retard ou non.
- [ ] Gérer les notifications comme dans la proof of concept précédente :
  - Quand j'ouvre l'app (elle était fermée ou en arrière-plan).
  - Effacer toutes les notifications. Ça remet à zéro le compteur de la limite.
  - Créer 6 notifications par prise, pour toutes les prises du jour : à l'heure de la prise, puis toutes les 10 minutes.
  - 64 notifications maximum. Vérifier que c'est bien la limite en dev, et si elle change avec un compte payant.
  - Créer aussi les notifications des prises de demain tant que la limite de 64 n'est pas atteinte. Ainsi, si je saute une journée entière, j'ai quand même des notifications le lendemain.
  - Si j'ouvre l'app et qu'une notification est prévue dans moins d'une minute (valeur en config), ne pas la recréer : elle s'afficherait pendant que l'app est ouverte (seulement cette notification).
  - Quand j'appuie sur « Je l'ai pris » ou « Ignorer », toutes les notifications du jour sont effacées, puis replanifiées pour les prises à venir.
- [ ] Badge : afficher un badge pour chaque prise en retard (aujourd'hui, heure passée, sans `intake_log`), si c'est possible app fermée.
- [ ] Vérifié par moi (pause, sauf si je dis le contraire) : je peux installer sur mon iPhone le build Release, autonome, qui expire au bout de 7 jours.

## Hors scope

- Médicaments à la demande (prazépam).
- Annuler un « Je l'ai pris » ou un « Ignorer » : prévu plus tard (suppression de l'`intake_log` et replanification des notifications si besoin).
- Archiver une prise depuis l'interface.
- Modale d'erreur quand l'enregistrement échoue.
- Image en pièce jointe dans les notifications.
- Tout ce qui n'est pas clairement dans cette spec. En cas de doute, me poser la question avant d'implémenter.

## Décisions

### Base de données

- **Nommage** : aligné sur le schéma existant. Table `intake_log` : `id`, `intake_id`, `expected_intake_at`, `created_at`, `status` (`"taken"` | `"skipped"`).
- **Dates** : texte en heure locale, sans fuseau (`"2026-10-14T08:20"`). Filtre du jour simple, lisible depuis Swift (futur widget).
- **Archivage plutôt que suppression** : colonne `intake.is_archived` (`false` par défaut), pour garder l'historique (statistiques plus tard).
  - Prises archivées exclues des requêtes « Aujourd'hui », Pilulier et notifications.
  - Clé étrangère `restrict` : SQLite refuse de supprimer une prise qui a des logs.
  - Pas d'action « Archiver » dans l'interface pour l'instant.
- **« Vider la base »** (outil de dev) : supprime vraiment tout, logs d'abord.
- **Log de fixture** : inséré seulement en `__DEV__`. En Release, on a les médicaments et les prises, sans historique (pour ne pas fausser le vrai test du jour).

### Écran « Aujourd'hui »

- **Section « Plus tôt »** : artboards `today-undo` et `empty-today-done` du design. Petites cartes sans boutons : « Pris à 09:05 » ou « Ignorée ».
- **Pris en retard** : validée plus de 30 min après l'heure prévue (même seuil que l'écran actuel). Pastille orange, style « en retard » (couleur + icône d'alerte) : « Pris en retard à 09:05 ».
- **Prise sans log** : règle de la spec 07 inchangée (en retard 30 min après l'heure prévue).
- **Tout est traité** (pris ou ignoré) : carte « C'est tout pour aujourd'hui » (`empty-today-done`) au-dessus de « Plus tôt », sans la phrase « Prochaine prise demain à… ».
- **Résumé de l'en-tête** : le premier nombre (« 2 prises sur 4 ») compte les prises prises **et** ignorées.
- **Pendant l'enregistrement** : bouton désactivé jusqu'à ce que le statut soit défini. En cas d'échec, le bouton se réactive, sans message.
- **Log enregistré mais replanification en échec** : on garde le log, tout sera replanifié à la prochaine ouverture.
- **Notifications refusées** : petit message sur l'écran « Aujourd'hui » (« Les rappels sont désactivés ») avec un lien vers les Réglages iOS.

### Notifications

- **Permission** : demandée au lancement de l'app.
- **Déclencheurs** : lancement de l'app, retour au premier plan, appui sur « Je l'ai pris » / « Ignorer ».
- **Nettoyage complet** à chaque déclencheur : annuler les notifications planifiées, effacer celles déjà affichées, remettre le badge à 0. Puis tout replanifier.
- **Rappels d'une prise** : 6 rappels, espacés de `intake.reminderIntervalMinutes` (colonne de la prise).
  - Seulement les rappels encore à venir : une prise prévue à 08:20, app ouverte à 08:35 → 08:40, 08:50, 09:00, 09:10. Après le dernier, plus rien pour cette prise aujourd'hui.
  - Prises déjà validées (pris ou ignorées) : aucun rappel.
  - Rappel prévu dans moins d'une minute : pas recréé.
- **Config** (`src/config/`) : nombre de rappels (6) et délai « moins d'une minute ».
- **Demain** : prises du lendemain ajoutées tant que le total reste ≤ 64.
- **Limite de 64** : limite iOS par app, identique avec un compte gratuit ou payant. 4 prises × 6 rappels × 2 jours = 48.
- **Badge** : possible app fermée. Chaque rappel porte un chiffre calculé à l'avance : le nombre de prises de ce jour-là dont l'heure est passée et sans log, au moment du rappel.
- **Contenu** : titre « C'est l'heure de votre prise de 08:20 », corps « 1 × Lithium 250 mg, 1 × Lamictal 50 mg ». Seulement l'icône Pilbo (automatique), pas d'image en pièce jointe.

### Tests

- **Jest** :
  - requêtes (logs du jour, prises archivées exclues) ;
  - calcul des états avec les logs (pris, ignorée, pris en retard) ;
  - calcul pur des rappels et des badges, avec une heure fixée.
- **Maestro** : appui sur « Prendre » → la prise apparaît dans « Plus tôt ». Les notifications sont vérifiées par moi sur l'iPhone.
