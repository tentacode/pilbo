# Planifier toutes les notifications

Se base sur `src/notifications.ts` (voir `docs/notifications.md`) : `scheduleReminders()` planifie déjà les rappels d'**une** prise. Cette spec planifie les rappels de **toutes** les prises.

Principe : à chaque ouverture de l'app, on annule tout et on recrée tout, pour empiler un maximum de rappels dans la limite iOS de 64 notifications planifiées.

Ce dont on a besoin :

- [ ] Une liste de prises, chacune avec une heure (ex : 8h30, 12h, 20h30) et un message (ex : « 1x lithium 50mg, 1x lamictal 25mg »).
- [ ] Une fonction qui calcule la date de départ de chaque prise : aujourd'hui si l'heure n'est pas passée, sinon demain.
- [ ] Une fonction qui remplit les 64 places : les prises sont planifiées jour après jour (ex : 3 prises × 6 rappels = 18 par jour → 3 jours d'avance) jusqu'à ce que le jour suivant ne rentre plus.
- [ ] À l'ouverture de l'app : `cancelScheduledReminders()` puis `scheduleReminders()` pour chaque prise de chaque jour.
- [ ] Valider une prise (« I took my meds ») retire uniquement les rappels restants de cette prise, les autres prises sont conservées.
- [ ] Tests unitaires pour le calcul des dates et le remplissage des 64 places (fonctions pures, pas besoin d'iOS).

## Questions ouvertes

- Où est stockée la liste des prises : en dur pour l'instant, ou déjà dans SQLite (Drizzle) ?
- Y a-t-il un écran pour modifier les prises, ou est-ce hors scope ?
- Valider une prise : annuler uniquement ses identifiants, ou tout annuler et recréer sans elle ?
- Une prise validée doit-elle le rester après un redémarrage de l'app (nécessite du stockage) ?
- Quelle valeur pour le badge : toujours 1, ou le nombre de prises restant à prendre ?
- Que se passe-t-il si l'app n'est pas ouverte pendant plus de ~3 jours : faut-il une dernière notification « Ouvre Pilbo pour garder tes rappels » ?
