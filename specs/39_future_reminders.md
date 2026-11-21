# Rappels planifiés sur plusieurs jours

Aujourd'hui, seuls les rappels d'aujourd'hui et de demain sont planifiés (`rescheduleReminders.ts`). Si l'utilisateur n'ouvre pas l'app et ne touche à aucune notification, plus rien ne sonne après demain. Ça vaut aussi pour une prise hebdomadaire ou mensuelle : elle ne sonne que si l'app a été ouverte la veille ou le jour même. Ça casse le principe de l'app.

## Fonctionnement

### Remplir tous les emplacements

- On planifie les rappels jour après jour : aujourd'hui (prises sans log), puis demain, après-demain, etc.
- Chaque prise apporte ses 6 rappels d'un bloc, comme pour « demain » aujourd'hui. Si les 6 ne rentrent plus, on s'arrête.
- On s'arrête aussi quand le plafond est atteint, ou au bout d'un an au maximum, pour couvrir les prises tous les 6 mois.
- Dans tous les cas, on empile les rappels jusqu'au plafond de 63 : il n'y a plus de limite à demain. Exemple : avec une seule prise par jour, on planifie 10 jours (60 rappels). Les 3 places restantes ne servent que si une alerte de stock bas tombe dans cette période.
- Les alertes de stock bas sont intégrées dans l'ordre chronologique, avec les rappels.
- Les jours suivants suivent la récurrence (`isIntakeDueOn`) : semaines en pause, date de début, prises hebdomadaires et mensuelles.
- Badge : même calcul que pour demain aujourd'hui (prises en attente de ce jour-là).
- Même plafond de 64 sur iOS et Android.

### Avertissement « ouvrez l'app »

Déjà en place (voir `docs/notifications.md`, `planReopenAppWarning`) : il part 5 min après le dernier rappel de prise planifié et garde 1 place sur les 64. Vérifier qu'il suit bien le dernier rappel des jours suivants.

## Décisions

### Technique

- `planReminders` reçoit la liste des prises par jour (aujourd'hui en premier) au lieu de `todayIntakes` / `tomorrowIntakes`.
- `rescheduleReminders` lit les prises une seule fois et les filtre par jour avec `isIntakeDueOn`, sans requête SQL par jour.
- Cette lecture unique suffit : les versions de prise valides aujourd'hui sont aussi celles des jours suivants, car `saveIntake` et `archiveIntake` écrivent toujours la date du jour dans `created_on` / `archived_on`.
- Les prises sans médicament restent exclues (jointure sur les médicaments, comme `getIntakesOfDay`).

### Calcul

- Horizon : jusqu'au même jour un an plus tard, inclus.
- Aujourd'hui : inchangé. Rappels encore à venir des prises sans log (une prise commencée peut en avoir moins de 6), dans la limite de 63.
- Point d'arrêt : au premier bloc de 6 rappels qui ne rentre plus, on s'arrête, sans essayer de caser les prises suivantes.
- Alertes de stock bas : triées avec les blocs de rappels par ordre chronologique (un bloc est daté par son premier rappel). Une alerte après le point d'arrêt ou après l'horizon d'un an n'est pas planifiée. Elles ne passent plus avant les rappels de demain comme aujourd'hui.

### Vérification

- Tests Jest, pas de test manuel sur l'iPhone ni sur le S9.
- Un test couvre un changement d'heure entre deux jours planifiés.
- Vérification réelle sur l'émulateur Android : les rappels planifiés sont listés avec `adb shell dumpsys alarm` (nombre, dates, avertissement). Le calcul est le même sur iOS. Pas d'affichage des notifications planifiées dans l'app.

## Hors périmètre

- Rappels quotidiens répétés (triggers `daily`).
- Plafond plus haut sur Android.
- Réglage pour désactiver l'avertissement.
- Réduire le nombre de rappels des jours suivants pour allonger l'horizon. Avec 63 emplacements, on couvre seulement les 10 prochaines prises (environ 2,5 jours avec 4 prises par jour). C'est accepté : un utilisateur qui n'ouvre pas l'app pendant 10 prises ne l'utilise pas vraiment, et l'avertissement le prévient.

## Vérification

- Tests Jest de `planReminders` et `rescheduleReminders` : plusieurs jours, plafond, prise mensuelle dans 3 semaines, alertes de stock bas dans l'ordre chronologique, avertissement après le dernier jour planifié.
- Mise à jour de `docs/notifications.md` (section « Calcul des rappels », et le calcul « 4 prises × 6 rappels × 2 jours = 48 » de la section « Contraintes iOS »).
- `make tests` doit passer.
