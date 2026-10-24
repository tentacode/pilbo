# Calendrier

On veut intégrer un calendrier mensuel de l'historique des prises, accessible depuis l'écran « Aujourd'hui ».

Le design est sur Claude Design, sous « Aujourd'hui · Calendrier (octobre) » : https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4

Les boutons d'accès au calendrier du design sur « Aujourd'hui » ne sont pas repris, on fait notre propre design. L'écran du calendrier doit correspondre au design, des modifications restent possibles.

## Fonctionnement

### Accès au calendrier

Icône calendrier en haut à droite de l'en-tête d'« Aujourd'hui ».

### Jour précédent / suivant

Depuis « Aujourd'hui », on peut naviguer d'un jour à l'autre, de manière discrète : des chevrons autour de la petite ligne de date (`‹ vendredi 23 octobre ›`).

Sur un jour passé, le titre de l'écran devient « Hier », « Avant-hier », sinon la date (« Mardi 21 octobre »). Un lien « Revenir à aujourd'hui » apparaît.

### Calendrier

L'écran du design : retour « Aujourd'hui », titre, mois, mois précédent / suivant, grille des jours, légende. La barre d'onglets reste visible, onglet « Aujourd'hui » actif.

### Écran d'un jour

Depuis le calendrier, toucher un jour ouvre un sous-écran de la journée en question (retour « Calendrier »), avec les mêmes chevrons jour précédent / suivant.

## Décisions

### État d'un jour

Un seul état par jour, par ordre de priorité (les avertissements d'abord, puis les prises faites, puis les jours tout ignorés) :

1. « Non pris » : des prises étaient prévues et aucune n'a eu d'action (oubli total).
2. « Pris en retard » : au moins une prise prise en retard (seuil existant `LATE_THRESHOLD_MINUTES`, 60 min).
3. « Pris » : au moins une prise prise, les autres peuvent être ignorées ou sans action.
4. « Ignoré » : toutes les prises avec une action sont ignorées.

- Jour sans prise prévue : neutre (numéro seul).
- Le hors planning ne change pas l'état du jour.
- Aujourd'hui : mêmes règles, seulement sur les prises déjà validées ou en retard. Rien encore : neutre. Contour « Aujourd'hui » du design.
- Légende adaptée : « Pris », « Pris en retard », « Non pris », « Ignoré », « Aujourd'hui ».
- Libellé VoiceOver par jour, comme le design (« 8 octobre : aucune prise », « 3 octobre : une prise en retard », « 23 octobre, aujourd'hui : pris »).

### Navigation et limites

- Pas de futur : « jour suivant » désactivé sur aujourd'hui, jours futurs non cliquables, mois suivant désactivé sur le mois courant.
- Limite dans le passé : premier jour avec une prise créée (ou un log). Avant : mois précédent et jour précédent désactivés.
- Le calendrier s'ouvre sur le mois courant.
- Chevrons et boutons : cibles d'au moins 44pt.

### Écran d'un jour passé

Lecture seule :

- Prises prévues ce jour-là, avec leur statut : prise (heure, retard), ignorée, non prise (nouvelle carte, dans le style « en retard », sans boutons).
- Médicaments hors planning pris ce jour-là (avec l'heure), sans bouton.
- Pas de bandeaux (stock bas, rappels désactivés), pas d'état « tout est fait » animé.
- Modifier une prise d'un jour passé : spec à part (voir `TODO_vrac.md`).

### Historique exact des prises

Aujourd'hui, la base ne garde pas l'historique des prises : une prise créée aujourd'hui apparaîtrait « Non pris » sur tous les jours passés, et modifier une prise changerait le passé. On versionne donc les prises.

- `intake` : nouvelles colonnes `created_on` et `archived_on` (dates locales `2026-10-24`, `archived_on` facultatif). Une version de prise couvre `[created_on, archived_on[`.
- Archiver une prise : `archived_on` = aujourd'hui (en plus de `is_archived`).
- Modifier une prise (heure, jours, médicaments, quantités) qui a des logs **avant aujourd'hui** :
  - l'ancienne version est archivée (`archived_on` = aujourd'hui) ;
  - une nouvelle version est créée (`created_on` = aujourd'hui) ;
  - les logs du jour passent sur la nouvelle version.
- Sans logs passés : modification sur place.
- Modifier seulement l'intervalle de rappel ne crée pas de version.
- Prises prévues un jour D : versions avec `created_on ≤ D < archived_on` et le jour de la semaine de D dans `days`.
- Pas de migration de données (l'app est réinstallée).
- Le schéma reste simple à lire depuis Swift (widget).

### Fixtures

- Prises créées environ 45 jours avant aujourd'hui.
- Logs générés relativement à aujourd'hui : majorité pris, quelques retards, un jour tout ignoré, un oubli total, du hors planning.
- Une prise modifiée il y a environ 10 jours (deux versions), pour tester l'historique.

### Assurance qualité

- Jest : état d'un jour (priorités, aujourd'hui, versions), requêtes (prises d'un jour passé, limites), versionnage à l'enregistrement d'une prise.
- Maestro `e2e/calendar.yaml` : ouvrir le calendrier, ouvrir un jour, jour précédent / suivant, revenir à aujourd'hui.
- Vérification sur l'iPhone : VoiceOver sur la grille, texte agrandi (grille sur iPhone 12 mini).
