# Écran « Aujourd'hui »

Chaque étape (case) doit être validée par moi avant de passer à la suivante.

On intègre l'écran « Aujourd'hui » du design Claude Design :
[https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4#page-dcb81aee8d83](https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4#page-dcb81aee8d83)

- Artboards de référence : « Aujourd'hui · Prochaine prise », « Aujourd'hui · Prise en retard », « Aujourd'hui · Cas limites ».
- En-tête : variante « En-tête · Variante Pilules ton sur ton ».
- État vide : artboard « Vide · Aujourd'hui, rien à prendre » (section « 7 · États vides »).
- Tweaks : « lavande » partout.
- Données : les prises du jour sont lues dans SQLite (fixtures actuelles), pas les données du design (Metformine, Mélatonine…).

Pas d'interaction pour l'instant, mais tout est prêt pour la prochaine spec (validation des prises).

## Étapes

- [ ] Retirer la règle de cloisonnement des features dans `docs/architecture.md` (une feature peut importer une autre feature quand c'est raisonnable).
- [ ] Déplacer `formatIntakeTime`, `sortIntakeMeds` et `compareMeds` du pilulier vers `domain/`. `docs/architecture.md` : `domain/` contient les types et des fonctions pures.
- [ ] Variantes du `Button` du design system : `variant` (primary, secondary, text), `size` (regular, large), `icon` optionnelle.
- [ ] Réglages (`__DEV__`) : boutons « Vider la base » et « Réinitialiser la base ».
- [ ] Requête `features/today/queries/getTodayIntakes(database, weekday)` : prises du jour filtrées en SQL, triées par heure, avec leurs médicaments. Spécifique à « Aujourd'hui » (peut diverger du pilulier). Tests `better-sqlite3`.
- [ ] Calcul des états (fonction pure, testée avec une heure fixée) : en retard, prochaine, plus tard, durées (« Dans 2 h 25 », « En retard · 40 min »), résumé de l'en-tête.
- [ ] Hook `useTodayData` : lecture au focus de l'onglet, recalcul des états à chaque changement de minute et au retour de l'app au premier plan (pas de nouvelle lecture SQL à chaque minute).
- [ ] En-tête « Pilules ton sur ton » : date du jour, bouton « Si besoin », titre, résumé.
- [ ] Cartes de prise (un composant par fichier) : en retard, prochaine, plus tard.
- [ ] Assemblage de l'écran : sections, état vide.
- [ ] Test Maestro simple.
- [ ] Mise à jour de la documentation (`docs/architecture.md` si de nouveaux choix récurrents apparaissent).

## Règles d'affichage

### États d'une prise

Sans historique en base, l'état dépend uniquement de l'heure :

- **En retard** : heure prévue passée depuis plus de 30 minutes. Affiche « En retard · durée », boutons « Je l'ai pris » et « Ignorer ».
- **Prochaine** : première prise à venir (ou dans sa marge de 30 minutes). Grande carte, mêmes boutons, « Dans 2 h 25 » ou « C'est l'heure ».
- **Plus tard** : les suivantes. Carte avec petit bouton « Prendre », « À venir ».

### Sections

- Aucune prise en retard : « Prochaine prise » puis « Plus tard ».
- Au moins une prise en retard : les prises en retard en premier (titre « N prises en retard » à partir de 2), puis « Ensuite » pour les prises à venir.

### En-tête

- Date du jour en français (« Dimanche 4 octobre »).
- Bouton « Si besoin » visible.

### État vide

Aucune prise prévue aujourd'hui : carte de l'artboard « Vide · Aujourd'hui, rien à prendre » (illustration, « Rien à prendre aujourd'hui », texte secondaire).

## Préparer la validation (prochaine spec)

- Boutons actifs et accessibles (rôle, libellé, haptique, 44 pt), mais sans effet.
- Callbacks (`onTake`, `onSkip`, `onAddUnscheduled`) remontés jusqu'à l'écran, qui ne fait rien pour l'instant.
- Le type d'état d'une prise est prévu pour accueillir « Pris » et « Ignorée ».

## Tests

- Jest : requête `getTodayIntakes` (filtre par jour, tri, prise sans médicament masquée), calcul des états et durées avec une heure fixée (dont la marge de 30 minutes), rendu RNTL des cartes (rôles et libellés), rendu RNTL de l'état vide (base vide).
- Maestro : titre, date du jour et présence des prises des fixtures. Pas de vérification des états horaires.

## Hors scope

- Validation des prises, historique en base, section « Plus tôt » (Pris, Ignorée), toast « Annuler ».
- Ajout d'une prise au besoin (le bouton est affiché sans effet).
- « Rappel à 13:20 » sur les prises en retard (ne sera pas affiché).
- Notes de médicament (« Avec le repas ») : absentes du schéma.
- Vraie recherche de la prochaine prise dans les jours suivants (état vide).
- i18n (artboard « Today · English »).

## Décisions

- **Libellés des boutons** : « Je l'ai pris » / « Ignorer » sur les grandes cartes (en retard, prochaine), « Prendre » sur les petites (plus tard). Facile à changer plus tard. Libellé d'accessibilité complet, ex. « Prendre la prise de 12:20 », « Ignorer la prise de 12:20 ».
- **Marge de 30 minutes** : de l'heure prévue à +30 min, la prise reste « Prochaine » avec le texte « C'est l'heure ». Ensuite elle passe « En retard », durée comptée depuis l'heure prévue (« En retard · 30 min »).
- **Durées** : écran « 45 min », « 2 h 05 », « 3 h » ; libellé VoiceOver en toutes lettres (« 2 heures 5 minutes »).
- **Date** : noms des jours et des mois en dur dans `utils/formatters.ts` (pas d'`Intl`), remplacés par l'i18n plus tard.
- **Passage de minuit** : rien de spécial, la liste n'est relue qu'au focus de l'onglet.
- **Boutons** : un seul `Button` dans le design system, étendu avec `variant` (primary, secondary, text), `size` (regular, large) et `icon` optionnelle.
- **Réutilisation du pilulier** : `formatIntakeTime`, `sortIntakeMeds` et `compareMeds` déplacés dans `domain/` (fonctions pures). `IntakeMedRow` reste dans `features/pillbox`, importé par « Aujourd'hui ».
- **Prise sans médicament** : masquée (filtrée en SQL), non comptée dans le résumé. La saisie devra l'empêcher plus tard.
- **État vide** : artboard « Vide · Aujourd'hui, rien à prendre », fond lavande de la carte remplacé par blanc avec bordure. Pas de résumé sous le titre. Phrase en dur « Prochaine prise lundi à 23:59. » (repère volontaire, à remplacer plus tard).
- **Outils de test (Réglages, `__DEV__`)** : « Vider la base » (supprime prises et médicaments) et « Réinitialiser la base » (vide puis réinsère les fixtures). Après « Vider la base », un relancement de l'app remet les fixtures (le seed s'exécute si `med` est vide).
