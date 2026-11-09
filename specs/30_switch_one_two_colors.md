# Switch "une couleur" / "deux couleurs"

Dans l'apparence c'est compliqué de choisir deux fois la même couleur, surtout quand on choisis une couleur perso via le slider.

Il faudrait rajouter en dessous du titre "Couleurs - Bleu ciel" et au dessus des tabs "Couleur 1" et "Couleur 2" un switch avec deux valeurs "Une couleur" et "Deux couleurs". Le switch a la même apparence que le switch de taille.

Par défaut le switch est à "deux couleurs". Sauf quand les deux couleurs sont identiques, dans ce cas c'est "une couleur" qui est sélectionné (voir Décisions pour le cas d'un nouveau médicament).

Quand on randomize, le switch suit le résultat : "deux couleurs" si les deux couleurs tirées sont différentes, "une couleur" si elles sont identiques. Le randomize garde son fonctionnement actuel (tirage indépendant des deux couleurs).

Quand le switch est sur "deux couleurs", on garde le fonctionnement actuel.

Quand le switch est sur "une couleur", on masque les deux tabs, et on laisse le panel de couleur et le slider en dessous. Si on choisi une couleur elle est appliqué comme deux fois la même couleur sur la pillule.

Aucun changement dans la base de données, on stock deux couleurs quoi qu'il arrive (deux fois la même si "une couleur").

## Décisions

### Position du switch à l'ouverture de l'écran Apparence

- Nouveau médicament (pas encore en base) dont les deux couleurs sont blanches (couleurs par défaut) : « Deux couleurs », pour que l'utilisateur comprenne qu'on peut en choisir deux.
- Tous les autres cas (médicament existant, y compris blanc / blanc ou modifié via un brouillon) : deux couleurs identiques → « Une couleur », sinon « Deux couleurs ».
- Limite acceptée : un nouveau médicament validé en « Une couleur » blanche rouvre l'écran sur « Deux couleurs » (blanc / blanc), sans effet sur ce qui est enregistré.

### Aléatoire

- `randomPillDesign` reste inchangé : les deux couleurs sont tirées indépendamment.
- Le switch suit le résultat : couleurs différentes → « Deux couleurs », identiques → « Une couleur ».

### Passage d'un mode à l'autre

- « Deux couleurs » → « Une couleur » : la couleur 1 est appliquée aux deux moitiés, tout de suite.
- « Une couleur » → « Deux couleurs » : les deux moitiés restent identiques, l'onglet « Couleur 1 » est sélectionné.
- Le panneau de couleur perso garde son état (ouvert ou fermé) et se cale sur la couleur 1.

### Interface et accessibilité

- Switch : `SegmentedControl` (comme la taille), libellé d'accessibilité « Nombre de couleurs ».
- Apparition et disparition des onglets sans animation.
- En mode « Une couleur », le nuancier a pour libellé d'accessibilité « Couleur » (au lieu de « Couleur 1 »).
- Le titre « Couleurs – <nom de la couleur> » ne change pas.

### Tests

- Jest uniquement : règle d'initialisation, passage une ↔ deux, synchronisation du switch après l'aléatoire, écran Apparence.
- Pas de flow Maestro. Vérification manuelle sur l'iPhone et le Galaxy S9 (VoiceOver / TalkBack, grand texte).
